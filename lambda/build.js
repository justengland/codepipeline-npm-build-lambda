// todo: stop writing files to disk for zip functions
// todo: make sure to do some solid validation for input and output stuff

var AWS = require('aws-sdk');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var unzip = require('unzip');
var archiver = require('archiver');
var stream = require('stream');
var shell = require('./shell');

var s3 = new AWS.S3({maxRetries: 2, "signatureVersion":"v4"});
var codepipeline = new AWS.CodePipeline();

var INPUT_SOURCE = '/tmp/input.zip';
var INPUT_DESTINATION = '/tmp/input';
var BUILD_TXT_DESTINATION = '/tmp/input/build.txt';
var OUTPUT_DESTINATION = '/tmp/build-out.zip';

module.exports = build;

function build(event, invokeId, onComplete) {

  var eventDetail = JSON.stringify(event, 0, 2);
  console.log('*************** \n Event', eventDetail, '\n*************** \n Event');
  // Retrieve the Job ID from the Lambda action
  var job = event["CodePipeline.job"];
  if(!job) throw 'event not in proper format: CodePipeline.job not found';

  var s3InputLocation = getInputS3Location(job);
  var s3outputS3Location = getOutputS3Location(job);

  var jobId = job.id;
  // var invokeId = context.invokeid;
  var isManualTrigger = job.manualCall; // this only used to help with lambdaDebugging;
  var shellCommands = getCommand(job);

  console.log('commands:', shellCommands);
  console.log('--->  Manual Trigger:', isManualTrigger);

  function handleFatalError(err) {
    if (err) {
      var failMessage = 'boo an error has occurred';
      if (isManualTrigger) {
        putJobFailure(failMessage, jobId, invokeId, function () {
          context.fail(err);
        });

      }
      else {
        context.fail(err);
      }
    }
  }

  // Basic control flow for the application
  clean(function () {
    getInputArtifact(s3InputLocation, function (err) {
      handleFatalError(err);
      unZipInputArtifact(function (unZipError) {
        handleFatalError(unZipError);
        runCommands(shellCommands, function () {
          zipOutputArtifact(s3outputS3Location, function (output) {
            putOutputArtifact(s3outputS3Location, function (putError) {
              handleFatalError(putError);
              var message = 'job finished - sweet';
              putJobSuccess(message, jobId, isManualTrigger, function () {
                console.log('-------      finished success!!!');
                onComplete && onComplete();
              });
            });
          });
        });
      });
    });
  });

}

// Extract the input file from lambda event
function getInputS3Location(job) {
  if(job && job.data &&
    job.data.inputArtifacts && job.data.inputArtifacts[0] &&
    job.data.inputArtifacts[0].location &&
    job.data.inputArtifacts[0].location.s3Location) {
    return job.data.inputArtifacts[0].location.s3Location;
  }
  else {
    console.log('event:', event);
    throw 'Could not find input s3Location';
  }
}

// Extract the output file from lambda event
function getOutputS3Location(job) {
  var result;

  if(job && job.data && job.data.outputArtifacts) {
    var outputArtifact = job.data.outputArtifacts[0];
    if(outputArtifact) {
      if(outputArtifact.location && outputArtifact.location.s3Location) {
        result = outputArtifact.location.s3Location;
      }

    }
    var result;
  }


  return result;


  if(job && job.data && job.data.outputArtifacts && job.data.outputArtifacts[0] &&
    job.data.outputArtifacts[0].location &&
    job.data.outputArtifacts[0].location.s3Location) {
    return job.data.outputArtifacts[0].location.s3Location;
  }
  else {
    console.log('event:', event);
    throw 'Could not find output s3Location';
  }
}

function getCommand(job) {
  if(job && job.data &&
    job.data.actionConfiguration && job.data.actionConfiguration.configuration &&
    job.data.actionConfiguration.configuration.UserParameters) {
    return job.data.actionConfiguration.configuration.UserParameters;
  }
  else {
    console.log('event:', job);
    throw 'Could not find commands';
  }
}

// Clean the working temp directory, to make sure we don't cross pollinate builds
function clean(onComplete) {

  rimraf(INPUT_SOURCE, function() {
    rimraf(INPUT_DESTINATION, function () {
      onComplete && onComplete();
    });
  });

}

// Read the file from S3 and put it into the working directory
// todo: stop writing files to disk for zip functions
function getInputArtifact(s3Location, onComplete) {
  var file = require('fs').createWriteStream(INPUT_SOURCE);
  var bucket = s3Location.bucketName;
  var key = s3Location.objectKey;
  var params = {
    Bucket: bucket,
    Key: key
  };
  console.log('getInputArtifact from s3:', params);

  s3.getObject(params)
    .createReadStream()
    .pipe(file);

  file.on('close', function() {
    onComplete && onComplete();
  });

}

// Unzip the archive into the working directory
// todo: stop writing files to disk for zip functions
function unZipInputArtifact(onComplete) {
  console.log('unzip:', INPUT_SOURCE);
  fs.createReadStream(INPUT_SOURCE)
    .pipe(unzip.Extract({ path: INPUT_DESTINATION }))
    .on('close', onComplete);
}

// todo: we should be running commands at this point
function runCommands(command, onComplete) {
  // Add build.txt - this just help to know when the build was created
  console.log('Adding Build.txt');
  var time = new Date().toISOString();
  fs.writeFile(BUILD_TXT_DESTINATION, time, function(err) {
    err && onComplete && onComplete(err);
  });

  // Execute commands passed in to the lambda function from code deploy
  if (!command) {
    console.warn('Please specify a command to execute on the lambda function within code pipeline');
    throw 'Please specify a command to execute on the lambda function within code pipeline';
    return;
  }

  shell(command, INPUT_DESTINATION, function(shErr) {
    console.log(command, 'finished:');
    onComplete && onComplete();
  });
}

// Zip up the working directory
// todo: stop writing files to disk for zip functions
function zipOutputArtifact(s3Location, onComplete) {
  if(s3Location) {
    console.log('Create output artifact:', OUTPUT_DESTINATION);

    var output = fs.createWriteStream(OUTPUT_DESTINATION);
    var archive = archiver('zip');

    output.on('close', function() {
      onComplete && onComplete(output)
    });

    archive.on('error', function(err) { throw err });
    archive.pipe(output);
    archive.bulk([
      { expand: true, cwd: INPUT_DESTINATION, src: ['**/*'] }
    ]).finalize();
  }
  else {
    onComplete && onComplete();
  }

}

// Read the output document so it can be pushed to S3
// todo: stop writing files to disk for zip functions
function readFile(onComplete) {
  console.log('readFile started:');
  fs.readFile(OUTPUT_DESTINATION, function (err, data) {
    if (err) throw err; // Something went wrong!

    onComplete && onComplete(data);
  });
}

// Push the result back to s3
function putOutputArtifact(s3Location, onComplete) {
  if(s3Location) {
    var bucket = s3Location.bucketName;
    var key = s3Location.objectKey;

    var params = {
      Bucket: bucket,
      Key: key
    };
    console.log('putOutputArtifact:', params);
    readFile(function(stream) {
      params.Body = stream;
      s3.putObject(params, function(err, data) {
        console.log('Upload Response:', data);
        onComplete(err);
      });
    });
  }
  else {
    onComplete && onComplete();
  }
}

// Notify AWS CodePipeline of a successful job
function putJobSuccess(message, jobId, isManualTrigger, onComplete) {
  var params = {
    jobId: jobId
  };
  if(isManualTrigger) {
    onComplete && onComplete();
  }
  else {
    codepipeline.putJobSuccessResult(params, function(err, data) {
      if(err) throw err;

      onComplete && onComplete();
    });
  }
}

// Notify AWS CodePipeline of a failed job
function putJobFailure(message, jobId, invokeId, onComplete) {
  var params = {
    jobId: jobId,
    failureDetails: {
      message: JSON.stringify(message),
      type: 'JobFailed',
      externalExecutionId: invokeId
    }
  };
  codepipeline.putJobFailureResult(params, function(err, data) {
    if(err) throw err;

    onComplete && onComplete();
  });
}
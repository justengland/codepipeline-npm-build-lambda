# codepipeline-lambda-npm-build - in progress
An AWS Lambda function used to integrate with codepipeline. This lambda function is designed to work with npm as the build tool.

## [CodePipeline Overview](https://aws.amazon.com/codepipeline/)
AWS CodePipeline is a [continuous delivery](https://aws.amazon.com/devops/continuous-delivery/) service for fast and reliable application updates. It is a perfect fit to deploy lambda functions and other AWS [serverless](https://leanpub.com/serverless) applications. 

### [CodePipeline Technical Overview](http://docs.aws.amazon.com/codepipeline/latest/APIReference/Welcome.html)
A CodePipeline is comprised of stages which are logical groupings of gates and actions. Each stage contains one or more actions that must complete before the next stage begins. A stage will result in success or failure. If a stage fails, then the pipeline stops at that stage and will remain stopped until either a new version of an artifact appears in the source location, or a user takes action to re-run the most recent artifact through the pipeline.

Since CodePipeline is a continuous delivery system once it is started it deploys or fails. If you want manual intervention for QA, it can be accomplished by running multiple code pipelines, for example you could create a CI pipleline, which monitors a github repo and deploys with every checkin. You could then create a test pipline that deploys a previously build pipeline to a test url. When QA signs off you can run the production pipleline to release to the public. 

```When creating a pipline using the wizard, you will be forced into using codedeploy or elastic beanstalk, this is not a requirement it is just a part of the wizard. You can use the scripts provided to create a basic codepipeline.```

## Build Tool Overview
This lambda is designed to [use npm as a build tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/). By using npm as the build tool it provides a consistent interface that can underlie the technology beneath it. It is still possible to use other build tools like grunt, gulp or webpack, just use [npm scripts](https://docs.npmjs.com/misc/scripts) to wrap the underlying tool used beneath it. 

## Build Tool Integration
```TODO, I need to build a publish helper```
If you manally set stuff up within the roles will be setup when you create the AWS resources. I have included the details of the roles in the aws folder.

#### Within AWS Lambda
1. Create a new lambda, skip the template
1. Give the lambda a name such as ```codepipleine-npm```
1. Runtime should be node.js
1. Run npm install on the ./lambda directory
1. Zip up the ./lambda directory
1. Upload the ./lambda directory

#### Within CodePipeline 
1. Create an action with a category of invoke
1. Give the action a name, and set the provider to AWS Lambda
1. Set the input argument artifact to the source that needs to be build, this can be an s3 bucket or github repository for example
1. Set the ouput argument if you want to pass the build to another action, this will be the build folder
<img src="https://raw.githubusercontent.com/justengland/codepipeline-npm-build-lambda/master/docs/action.png" width="200">
sample action setup
<img src="https://raw.githubusercontent.com/justengland/codepipeline-npm-build-lambda/master/docs/pipeline.png" width="200">
sample pipeline setup

## Development instructions
```TODO: build out the deployment tools```
```TODO: build a good sample project to reference```


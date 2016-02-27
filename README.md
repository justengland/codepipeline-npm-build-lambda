# codepipeline-lambda-npm-build - in progress
An AWS Lambda function used to integrate with codepipeline. This lambda function is designed to work with npm as the build tool.

## [CodePipeline Overview](https://aws.amazon.com/codepipeline/)
AWS CodePipeline is a [continuous delivery](https://aws.amazon.com/devops/continuous-delivery/) delivery service for fast and reliable application updates. It is a perfect fit to deploy lambda functions and other AWS [serverless](https://leanpub.com/serverless) applications. 

### [CodePipeline Technical Overview](http://docs.aws.amazon.com/codepipeline/latest/APIReference/Welcome.html)
A code pipeline is comprised of stages which are logical groupings of gates and actions. Each stage contains one or more actions that must complete before the next stage begins. A stage will result in success or failure. If a stage fails, then the pipeline stops at that stage and will remain stopped until either a new version of an artifact appears in the source location, or a user takes action to re-run the most recent artifact through the pipeline.

Since codepipeline is a continuous delivery system once it is started it deploys or fails. If you want manual intervention for QA, it can be accomplished by running multiple code pipelines, for example you could create a CI pipleline, that monitors a github repo and deploys with every checkin. You could then create a test pipline that deploys a previously build pipeline to a test url. When QA signs off you can run the production pipleline to release to the public. 

```When creating a pipline using the wizard, you will be forced into using codedeploy or elastic beanstalk, this is not a requirement it is just a part of the wizard. You can use the scripts provided to create a basic codepipeline.```

## Build Tool Overview
This lambda is designed to [use npm as a build tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/). Buy using npm as the build tool it provides a consisant interface that can underly the technology beneath it. It is still possible to use other build tools like grunt, gulp or webpack, just use [npm scripts](https://docs.npmjs.com/misc/scripts) to wrap the underlying tool used beneath it. 

## Build Tool Integration
```TODO, I need to build a good sample project to referance```

## Development instructions
```TODO, I need to build out the tools```

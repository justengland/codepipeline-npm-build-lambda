var lambdaExecute = require('./lambda/index');
var event = {
  "CodePipeline.job": {
    "id": "dc265722-2684-4c04-bef9-c9b3aaeea3cb",
    "accountId": "163859100295",
    "manualCall": true,
    "data": {
      "actionConfiguration": {
        "configuration": {
          "FunctionName": "codedeploy-demo",
          "UserParameters": "npm install;npm test;npm run deploy"
        }
      },
      "inputArtifacts": [
        {
          "location": {
            "s3Location": {
              "bucketName": "codepipeline-us-west-2-198795324424",
              "objectKey": "sample/MyApp/byqueeI.zip"
            },
            "type": "S3"
          },
          "revision": null,
          "name": "MyApp"
        }
      ],
      "outputArtifacts": [
        {
          "location": {
            "s3Location": {
              "bucketName": "codepipeline-us-west-2-198795324424",
              "objectKey": "sample/after-lamb/Ndunywv"
            },
            "type": "S3"
          },
          "revision": null,
          "name": "after-lambd"
        }
      ],
      "artifactCredentials": {
        "secretAccessKey": "moIZYBEoR/h/U0ddB0CiO5txh7OcsE2GxnXOavLK",
        "sessionToken": "AgoGb3JpZ2luEAEaCXVzLXdlc3QtMiKAAjAcFqJyJ7sYHqsUn4QayRBbS09o46BQJy0jchC9Dc3kw6JCpFCDq4+uVH/ZEq6r53Qg/lOYKqyPy20ejtybjU3rOs7wykB3pZ2QO7IqPcdzqxTGfnOFkzB0DY/QkzXNA56FYvTavpDDODqho+3z/tGbF/6rYtkWjQe5P7/rD6aMP3FL5Wmh5PytYYGshjMVjlCp3GeY9XP8IfdMS0MT4Pm39rGlMo91QyTdgra0JGDAhSo7KEyt7fMqat+8z+2AoJKoJfWmaa19vM841cckQ0IbszRlpQkzddex3jJixYo+5gY8a2qGT34FGba/1xXhUpwMWuIg3zXpFvzyuxRupQ0qlAQIVhAAGgwxNjM4NTkxMDAyOTUiDF1FooJclAYVkLsslCrxA8hMfa+pXICs8tQgEwkBY99C17Chnta7+GqsmCo0T4/th7N/b1H7RYvn+NoPr0Vx7bLK7ugXt9C6bsarEjjpFQpSWiG7y3AmhAqcqtkkN/5dyXWiIFuuE1H1r0w4Otj+wDWmwp3eSF/H/m1Aq8uXJfa04HlSQqfaFHmwspXq5oTAfRZr2ESpXRrLE1wqYr2l/Mm6il3OiveXzYFoG19TD8zUVisIg3XK1KGM8QVzCjUymCGOzhI7M4mA6zPu3AUYOz2WHRULEyvmOFAsbyGgON7uu8ZTZkjRcnpXkPqWY48hLOB/26eq3TTshjY6wzJV2uo5/gNq9ku4T7vvPJe3LYm6jWmLKJ5hOcnAM2n8tVQHCkwiGKB7vYVpI3tuW0P4EwDuHw0pv8UqTmju641Bzh4zm21DEGBoEGlZ2F14xgko28MM5pYdu2YG+1FH4Xz1suwd+flIu26ZvAoCYuPJlaFWEj2IgitN8UKaGaYfQ6BOC48Ql/EbpBuOSSx+zrMbc2tFIwcCPoByBnwekLLdyvEXsQZSvg5qNUzmvJNhBnGbnROYB3ULNHnBbvnSzRhZqga7SydU3BhFxKItavNShNSbdVW8/Z2wvfxS4NIERfVSefRAXiYuw1Pl1F6YQYqUQWkv9o3UqyB4EycWAaWDPQ3HMIj1tLYF",
        "accessKeyId": "ASIAIEUBMWTKLB5ZGVIQ"
      }
    }
  }
};
var noOutputEvent = {
  "CodePipeline.job": {
    "id": "c869af7a-7662-470d-8733-d306b05dc45a",
    "accountId": "163859100295",
    "manualCall": true,
    "data": {
      "actionConfiguration": {
        "configuration": {
          "FunctionName": "codedeploy-demo",
          "UserParameters": "npm run test-suite-2-a"
        }
      },
      "inputArtifacts": [{
        "location": {
          "s3Location": {
            "bucketName": "codepipeline-us-west-2-198795324424",
            "objectKey": "sample/BuildPacka/3EmxS2G"
          },
          "type": "S3"
        },
        "revision": null,
        "name": "BuildPackage"
      }],
      "outputArtifacts": [],
      "artifactCredentials": {
        "secretAccessKey": "jIGiM3ofBneP56y1WShEFp0wJMjAuEWLRultxTzj",
        "sessionToken": "AgoGb3JpZ2luEFoaCXVzLXdlc3QtMiKAAnIAg3gqa5aG8lPW1qFp7ex5rTEotvf4t5Tf/sL6mEr5MLuFuXHBWLghTeOroErRyD0ENfDXkwMzUo9zXi4M5jqv9XeyNobPctigygSQZufBDJhpu4uLoUTeHV3ppoSIMTb1EcXVt1aDwaKxBaWAPYlj2uDoL5x6pNvgmiUWKeahKgEpmYTLgPLis5yQdhcOntMI8CtZWEbS//6s6zPtCrx7hrEfe5t03X3iRhuL8+pZK61hSEn8izyz8iFuL40K64SNr+nNn2Zx1sU2TA+Exb8SdD9cvK9mHxl1jqG2BBYwQHysoQBK5QU5Gr2VQc54iGwO7AB91Pe55vSCrnA3bskq9wMIr///////////ARAAGgwxNjM4NTkxMDAyOTUiDKklsj0UECS061VBsirLA3bsqnng+HTKNtfQo9rmVl052LNeU/lxg608Dgy23hEhYxoVmvNiO4ZdpYHlukojfRWVkQzfOSetdI63I2gry7e+aU//3FYC30oC2I79oA+BwWOAr5WrTDx/Jk5X4tFhS+4O2xUqXxyh/Q44xlwqDbOIdXqdF+6hSo9SQEkzoqfgkLQJa0+4D5D6kxG5+kU2IbyLKVhzaTNY9hLqf9+hO37hvjiJL91IuZ8YGAg1XEBIu98NvcJV5kj2Zmc+H4SEMS3wxsWUgziHb4Vl8LJ31hc5ALjA4qoSXh1tLAun1Q/ueJ3xPyoQldforIkNoU5vb/jviJKpdQiOtP/TiNqQDxJoLCszMIdaDPeo+l0o2DrGQT2h0dSFYSdqjZCRU0RFbHJdDGAF9t9ydYrCfO21UpU57W+OdFkvD3duYUP0PWCOyYcxfu25t/8AQbVa6Jk/saQY9/v80hfCCD/zrFd4mnMeqUmsuGxmbe4zqrwrqdi6eLdQFE+l5pBlviDm9PGxDAuNoWMENQylF/1MhDMV6ka8NiBMi4/bQXh4zyFLPADSp/DkYlqrOpG1tyGEpRezhCmwyGux/70JCwdNmZ1pRfFEtVAGK3sLY+FhIzCYv8i2BQ==",
        "accessKeyId": "ASIAJDSVGNOIUCIQCXBQ"
      }
    }
  }
};
var context = {
  done: function() {
    console.log('done called::', arguments);
  }
};

//lambdaExecute.handler(event, context);
lambdaExecute.handler(noOutputEvent, context);
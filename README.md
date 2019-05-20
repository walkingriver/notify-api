---
layout: post
title: Hosting the Notify API
date: '2019-05-287T15:15:00.002-04:00'
author: Michael Callaghan
tags: firebase,functions,node
layout: post
feature: assets/img/
thumbnail: https://walkingriver.com/assets/img/
cover_image: https://walkingriver.com/assets/img/
canonical_url: https://walkingriver.com/notify-api/
published: false
---

As part of my recent Pluralsight Course, [Building Progressive Web Apps with Ionic](https://app.pluralsight.com/library/courses/progressive-web-apps-ionic/), I needed a public-facing API that its demo application could call. I implemented a simple Node/Express web service and deployed it to Firebase Functions using Google free "Spark" Plan. One major drawback to the Spark Plan is that it has a pretty low threshold limit for the number of requests per minute it will allow. In this post, I will describe how you can download the web service's code and host it both locally and in your own Firebase account, and then how to modify the course's demo app to call your version instead of mine.

<!--more-->


# Install the Prerequisites

If you are following along in the course, and have completed installing the tools, you should have everything you need already.

## NodeJS
You will need at least Node 6 to run the API. You can download it directly from www.nodejs.org.

Once Node is installed, you also have `npm`, and can use it to install the rest of the tooling you'll need.

## Firebase CLI

Next, install the Firebase tools.

```bash
npm install -g firebase-tools
```

# Clone the Repository

With Node and Firebase out of the way, you can clone the project's repository from GitHub. Remember, cloning creates a folder, so there is no need to provide an empty folder first. Use either of the following commands, depending on how you prefer to interact with GitHub.

```bash
git clone https://github.com/walkingriver/notify-api.git
# or
git clone git@github.com:walkingriver/notify-api.git
```

# Install the Dependencies

Enter the folder created during the repository clone, by default it will be `notify-api`, and then install its dependencies.

```bash
cd notify-api
npm install
```

Next is a quirk I find particularly annoying. The API lives in a folder called `functions`, and it also has a `package.json` file. Thus, it also has dependencies. Enter that directory and install them, too.

```bash
cd functions
npm install
cd ..
```

# Create Firebase App

Open a browser to the [Firebase Console](https://console.firebase.google.com). If you have not yet registered with Firebase, do that first. 

Once at the console, Add a new project. Call it anything you want, but remember your choice. If you pick something that isn't unique, such as "notify-api," some random characters will be automatically appended for you. You can probably keep the default settings, but you may want to ensure that the Location is somewhere close to you. Accept the terms and click `Create Project`.

# Connect Project to Firebase App

Now that you have a project, you need to connect it to the repo that you just cloned. First, make sure you are logged into Firebase. Enter the following command.

```base
firebase login
```

If you are not logged in, you will be directed to do so, and a browser will open to let you do that. If you are logged in, the command will tell you so.

Next, enter the following command to connect this local project to the Firebase project.

```bash
firebase use --add
```

All of your Firebase projects will be displayed. Use the up/down arrow keys to select the project you just created and continue.

You will be asked to provide an alias, such as "staging". This is to enable support of CICD, where you can deploy different versions of the app to different projects. In this case, I recommend keeping it simple. I named mine "default." Type your preferred alias and continue.

# Verify Service Functionality

To verify that the service is working, you will want to build it and run it locally. These commands should be run from inside the `functions` folder.

```bash
cd functions 
npm run build
firebase emulators:start --only functions
```

If all goes well, you will be provided with some command output that includes the URL of the API itself. Here is the output from mine.

```bash
i  Starting emulators: ["functions"]
✔  functions: Using node@6 from host.
✔  functions: Emulator started at http://localhost:5001
i  functions: Watching "/Users/callm031/git/wr/notify-api/functions" for Cloud Functions...
i  functions: HTTP trigger initialized at http://localhost:5001/my-notify-api/us-central1/api
```

Open a browser to the URL provided. There is no route listening there, so add `latest` to the URL, and you should be rewarded with a JSON object that looks like this...

```json
{
  "event": {
    "id": 50,
    "created": "2019-05-21T16:55:22.114Z",
    "dialed": "911",
    "caller": {
      "id": "ff196571-00c3-421c-8d84-01d1964599a3",
      "firstName": "Virgil",
      "lastName": "Glover",
      "phone": "1-850-512-1051 x5535",
      "address": {
        "street1": "4684 Fahey Highway",
        "street2": "Apt. 131",
        "city": "South Daytonfurt",
        "state": "CT",
        "zip": "54912"
      }
    }
  },
  "links": {
    "acknowledgements": "/acknowledgements/50/1558457722114",
    "self": "/event/50",
    "next": "/event/49"
  }
}
```


Press Ctrl-C to shut down the Firebase emulator.

# Deploy to Firebase

Once you know it is working locally, you can deploy it to your Firebase project. Make sure you are in the root directory of the project.

```bash
cd ..
firebase deploy --only functions
```

As with the emulator, you will see a lengthy and informative output from the deploy command, which will also include the public URL of the deployed API.

```bash
firebase deploy --only functions

=== Deploying to 'my-notify-api'...

i  deploying functions
Running command: npm --prefix "$RESOURCE_DIR" run lint

> functions@ lint /Users/callm031/git/wr/notify-api/functions
> tslint --project tsconfig.json

Running command: npm --prefix "$RESOURCE_DIR" run build

> functions@ build /Users/callm031/git/wr/notify-api/functions
> tsc

✔  functions: Finished running predeploy script.
i  functions: ensuring necessary APIs are enabled...
✔  functions: all necessary APIs are enabled
i  functions: preparing functions directory for uploading...
⚠  functions: Deploying functions to Node 6 runtime, which is deprecated. Node 8 is available and is the recommended runtime.
i  functions: packaged functions (51.93 KB) for uploading
✔  functions: functions folder uploaded successfully
i  functions: creating Node.js 6 (Deprecated) function api(us-central1)...
✔  functions[api(us-central1)]: Successful create operation. 
Function URL (api): https://us-central1-my-notify-api.cloudfunctions.net/api

✔  Deploy complete!
```

Make note of the URL provided, as you will need it in the next step. If you want to see it in action, as you did before, open a browser to that URL and again add `latest` to the URL, and you should be rewarded with the same JSON object as you saw when running it locally.

# Modify Notify Demo App to Use New API

Now it is time to open the Notify demo app project, which should already have if you are following along with the course. 

This value needs to be copied to `src/app/events.service.ts`, line 10 (assuming you have gotten that far in the tutorial). In my version of the Notify app, this section of the file looks like this...

```typescript
@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private endpoint = 'https://us-central1-ps-notify-api.cloudfunctions.net/api';

  constructor(private http: HttpClient) { }
```

Replace the value of `endpoint` with the value provided in the output of the `firebase deploy` command.

# Run Notify and Enjoy

Redeploy the Notify demo app to firebase, either locally, or to your Firebase application.

```bash
firebase serve
# or
firebase deploy
```

Open a browser to Notify using the URL provided by the above command. You now have your own version of the API. And you probably understand why I did not want to include this in the course itself. 

## Note on API Limits

Even with your own Spark hosting plan, you will probably run into API limits while developing. The good news is that you won't be competing with anyone else for those resources. When you do run into limits, your browser may complain about a CORS violation. I believe this to be a misleading error. Simply wait about 60 seconds for the API limit to reset, and try again. 

Of course, once you are using cached resources through the demo app's service worker, you will see this problem less often.

## Other Hosting Solutions?

I wonder sometimes whether or not hosting the web app elsewhere might be a better solution. My backup preference is to spin up a web application in Microsoft Azure, and I may do that one of these days. In the meantime, if anyone has other suggestions, please feel free to comment.

----

If you find any errors in this post or have other feedback, please follow me and comment on Twitter. I'm [@walkingriver](https://twitter.com/walkingriver).

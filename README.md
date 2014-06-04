# Subledger App

Subledger App is a full Javascript application, built to interact with Subledger API directly form the customers browsers. It is built on top of Ember and Ember Data, using Ember App Kit to get features like depency management (NPM), javascript frameworks dependency management (Bower) and also some nice scripts to help development and deployment (Grunt).

### Requirements

To develop this app, you need to have Node.JS and NPM installed. It was initially developed using Node.JS v0.10.26 and NPM 1.4.3. Also, the following instructions should work on both Linux and OSX.

### Setting up the Development environment

After clonning the project, access the created directory and execute the following:

1. Install Grunt Command Line Client: ```sudo npm install -g grunt-cli```
2. Install Bower: ```sudo npm install -g bower```
3. Install NPM: ```npm install```
4. Run the development server: ```grunt server```

Running this steps should install both NPM and Bower depencies. It not, try the following commands:

1. ```npm install```
2. ```bower install```

If previous steps succeed, you should be able to access the app at http://localhost:8000/.

### Production Deployment

Since this is a full Javascript, we don't need an application server for it. The production environment is comprised of a combination of Amazon S3 with Amazon Cloud Front.

To deploy/update it, execute the following steps:

1. Copy file aws.json.example to aws.json
2. Set S3 API credential and bucket info
3. Genereate static files: ```grunt dist```
4. Upload to S3: ```grunt s3```

The directories that are uploaded to Amazon S3 are listed on Gruntfile.js (look for S3).

It is also worth noting that the app is currently configured to set a Cache-Control max-age of 60 seconds. So you should wait at least this amount of time beforing seeing the changes on the production environment.

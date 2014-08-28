# Subledger App

Subledger App is a full Javascript application, built to interact with Subledger API directly from the customers browsers. It is built on top of Ember and Ember Data, using Ember-CLI to get features like depency management (NPM), javascript frameworks dependency management (Bower) and also some nice scripts to help development and build (Broccoli).

### Requirements

To develop this app, you need to have Node.JS and NPM installed. It was initially developed using Node.JS v0.10.26 and NPM 1.4.3. Also, the following instructions should work on both Linux and OSX.

### Setting up the Development environment

After clonning the project, access the created directory and execute the following:

1. Install Ember-CLI: ```sudo npm install -g ember-cli```
2. Install Bower: ```sudo npm install -g bower```
3. Install PhantomJS: ```npm install -g phantomjs```
4. Install NPM modules: ```npm install```
5. Install Bower packages: ```bower install```
4. Run the development server: ```ember serve```

If previous steps succeed, you should be able to access the app at http://localhost:4200/.

### Production Deployment

Since this is a full Javascript, we don't need an application server for it. The production environment is comprised of a combination of Amazon S3 and Amazon Cloud Front.

Deployment uses a tool called s3_website, which in turns depends on both Ruby and Java to be installed.

With those requirements installed, execute the following steps:

1. Install s3\_website: ```gem install s3_website```
2. Copy file s3\_website.yml.example to s3\_webiste.yml
3. Set S3 API credential and bucket info
4. Genereate static files: ```ember build --environment=production --output-path=dist/v2```
5. Upload to S3: ```s3_website push```

It is also worth noting that the app is currently configured to set a Cache-Control max-age of 60 seconds. So you should wait at least this amount of time beforing seeing the changes on the production environment.

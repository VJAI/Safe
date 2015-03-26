# Safe

## What?

Safe is a hybrid mobile app that helps to store photos safely. The stored photos are encrypted using AES-256 encryption algorithm. Safe runs successfully in both iOS and Android platforms.

## Why?

Safe is created in the aim to guide developers how to architect a hybrid mobile app using client-side technologies.

## How?

Safe is built using Cordova with plethora of client-side technologies like Backbone, Underscore, RequireJs and Handebars. Ratchet is used to provide the look and feel for the app.

## Setting up your machine

Node, Grunt and Bower are required to assist the development of the app. Cordova is needed to build the app. You should install these tools to build, run and deploy Safe.

Safe is browser runnable! You can run and debug directly in the browser for testing purpose. For running in emulator or deploying in a real device you need to setup your machine. The <a href="https://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides" target="_blank">cordova platform docs</a> will guide you to setup your machine for iOS and Android platforms.

For iOS, you need a Mac machine. You should also have to subscribe to the Apple Developer Program.

For Android, you can use either Windows or Mac.

## Running Safe

Once you've Node, Grunt CLI, Bower and Cordova installed in your machine then you can build and run Safe.

You might have to modify couple of properties in Gruntfile.js before executing any Grunt command.

### `supported` property

The `supported` property in the `config` object is and array that is used to specify the platforms that you've configured in your machine. As default, I'm assuming you've both iOS and Android platforms configured. If you are using Windows or you've only a single platform configured then you should update this property accordingly.

For ex., if you are using Windows then obviously you've only the android platform configured, so the value of the `supported` property is `['android']`.

```
var config = {
  supported: ['android'], // supported platforms
  ...
};
```

### `platform` property

The Grunt commands are designed in such that, at a time you can develop/run the app for a single platform. In better words. through a single command you can't install the app to both platforms. First you should run the command to install to one platform and then to other.

The `platform` property is used to control the default platform. If you've configured for only a single platform, let's say "android" then the value is "android".

If you are using Mac and have both the platforms configured then you can leave the default platform to "ios" or change it to "android". The value of this property can be changed through the parameter you pass in the Grunt command.

```
var config = {
  supported: ['android'], // supported platforms
  platform: 'android'     // default platform
};
```

Once your machine is setup, you should run the following grunt command as first.

```
> grunt create
```

This will install all the necessary node packages and bower components for the project. It'll also create a cordova project and add the supported platforms and plugins.

### Other Grunt Commands

[TODO]


## Settings

## License

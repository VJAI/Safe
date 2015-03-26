# Safe

## What?

Safe is a hybrid mobile app that helps to store photos safely using AES256 encryption. Safe runs successfully in iOS and Android platforms.

## Why?

Safe is created in the aim to help developers to teach them how to architect a hybrid mobile app using client-side technologies.

## How?

Safe is built using Cordova with plethora of client-side technologies like Backbone, Underscore, RequireJs and Handebars. Ratchet is used to decorate the look and feel.

## Setting up your machine

Node, Grunt and Bower are used to assist the development of Safe. Cordova is used to build safe. You should install these tools before you can build and run the app in your machine or device.

Safe is browser runnable! means, you can run and debug directly in the browser instead of using an emulator or a device. For running in emulator or deploying in a real device you need to configure your machine based on the <a href="https://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides" target="_blank">platform guidelines</a>.

For iOS, you need Mac and also you should subscribe to the Apple Developer Program. For Android, you can use Windows or Mac.

## Running Safe

Once you've Node, Grunt CLI, Bower and Cordova installed in your machine then you can build and run Safe. After downloading the sourcecode, you might have to modify couple of properties in Gruntfile.js before executing any Grunt command.

### `supported` property

The `supported` property in the `config` object is used to control the platforms that Safe supports. As default, I'm assuming you are using Mac and you've both iOS and Android platforms configured successfully. If you are using Windows or you've configured only a single platform then you should update this property accordingly.

For ex., if you are using Windows.. obviously you've only the android platform configured then,

```
var config = {
  supported: ['android'], // supported platforms
  ...
};
```

### `platform` property

The Project is structured and Grunt commands are framed in such that, at a time you can develop/run the app for a single platform. In better words, I can put it forward like this... through a single grunt command you can't install the app to both iOS and Android devices. First you should run the command to install to one platform and then to other.

The `platform` property is used to control the default platform you are targeting at.

If you've configured for only a single platform, let's say "android" then the value is "android".

If you are using Mac and have both the platforms configured then you can leave the default platform to "ios" or change it to "android". The value of this property can be changed through the parameter you pass in the Grunt command.

```
var config = {
  supported: ['android'], // supported platforms
  platform: 'android'     // default platform
};
```

Once your machine is setup, you should run the following grunt command before running others.

```
> grunt create
```

This will install all the necessary node packages and bower components for the project. It'll also create a cordova project and add the supported platforms and plugins.

### Other Grunt Commands

[TODO]


## Settings

## License

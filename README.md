# Safe

## What?

Safe is a hybrid mobile app that helps to keep your photos safe. The stored photos are encrypted using AES-256 algorithm. Safe supports iOS and Android platforms.

## Why?

Safe is created in the aim to guide developers how to design and develop a hybrid mobile app using client-side technologies.

## How?

Safe is built using Cordova and with plethora of client-side technologies like Backbone, Underscore, RequireJs and Handebars. Ratchet is used to provide the look and feel for the app.

## Setting up the machine

You've to install Node, Grunt, Bower and Cordova. To configure the machine for iOS and Android developments the <a href="https://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides" target="_blank">cordova platform docs</a> will help you.

## Running Safe

Once you've installed the necessary tools and downloaded the source-code, you might have to modify couple of configuration properties in the grunt file (Gruntfile.js).

### The `supported` property

The `supported` property is an array that is used to specify the platforms that you've configured in your machine.
If you are using Windows then you can configure only for the android platform, so the value of the `supported` property is `['android']`.

### The `platform` property

At a time you can run Grunt commands for a single platform. For example you cannot build the source-code for both the platforms through a single command. You've to pass the platform parameter along with the Grunt commands. If you don't pass the parameter then what you've specified in the `platform` property is used.

### Grunt commands

Once your machine is setup, you should run the following command as the first thing.

> grunt create

This will install all the node packages and bower components required for the project. It'll also create the cordova project and install the supported platforms and plugins.

Following are the other important grunt commands you should know.

Assuming you've configured both the platforms and the default platform is 'ios'.

| Command                           | Purpose       |
| --------------------------------- | ------------- |
| grunt serve                       | Start a web server and run the app for iOS in browser |
| grunt emulate                     | Build the app and run it in iOS emulator |
| grunt deploy                      | Deploy the app in iOS device |
| grunt serve --platform=android    | Start a web server and run the app for Android in browser |
| grunt emulate --platform=android  | Build the app and run it in Android emulator  |
| grunt deploy --platform=android   | Deploy the app in Android device  |
| grunt tests                       | Run the Jasmine unit tests |

Please scan the grunt file and discover other grunt commands.

## Settings

The key that is used to encrypt the credential is stored in the settings file which exist under src/js. You SHOULD update the `encDecKey` and set a complex base64 string to it.

## Contributions

Safe supports currently iOS and Android platforms. If you are interested to extend the support to other platforms please <a href="http://www.prideparrot.com/contact">contact me</a>.

## License

Copyright Vijaya Anand, http://www.prideparrot.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

>> You are free to use the app for your own personal use.

>> You are not allowed to sell this app in same or different name.

>> You are also not allowed to build and sell apps by copying maximum portion
   of the source code.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

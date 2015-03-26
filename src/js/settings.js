// Contains all the configuration settings of the app.
define(function() {

  'use strict';

  return {
    encrypt: true, // Settings this to false will not encrypt the photos, not a good idea!
    encDecKey: 'WW91clNlY3JldElzU2FmZVdpdGhNZQ==', // Encryption key for credential. Don't reveal this to anyone!
    targetWidth: 320, // Width in pixels to scale image. Must be used with targetHeight. Aspect ratio remains constant. (Number)
    targetHeight: 480 // Height in pixels to scale image. Must be used with targetWidth. Aspect ratio remains constant. (Number)
  };
});

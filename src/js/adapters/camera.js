// Camera module.
// A wrapper to the cordova camera plugin.
// Contains methods to access the built-in camera, album and library.
define(['jquery', 'underscore', 'settings'], function ($, _, settings) {

  'use strict';
  
  return {

    getPicture: function (options) {

      var d = $.Deferred(),
        cameraOptions = _.extend({
          encodingType: navigator.camera.EncodingType.JPEG,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          targetWidth: settings.targetWidth,
          targetHeight: settings.targetHeight
        }, options);

      navigator.camera.getPicture(d.resolve, d.reject, cameraOptions);
      
      return d.promise();
    },

    capturePicture: function () {
      return this.getPicture({
        sourceType: navigator.camera.PictureSourceType.CAMERA
      });
    },

    getPictureFromAlbum: function () {
      return this.getPicture({
        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
      });
    },

    getPictureFromLibrary: function () {
      return this.getPicture({
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
      });
    }
  };
});
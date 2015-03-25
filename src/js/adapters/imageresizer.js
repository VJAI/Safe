// Cordova Image Resizer Module.
define(['jquery'], function ($) {

  'use strict';

  return {
    resize: function (imageBase64, width, height) {
      var d = $.Deferred();

      window.imageResizer.resizeImage(function (data) {
        d.resolve(data);
      }, function (error) {
        d.reject(error);
      }, imageBase64, width, height, {
        imageType: ImageResizer.IMAGE_DATA_TYPE_BASE64,
        resizeType: ImageResizer.RESIZE_TYPE_PIXEL,
        storeImage: false,
        pixelDensity: true,
        photoAlbum: false
      });

      return d.promise();
    }
  };
});
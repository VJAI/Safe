// FileStorage module.
// A wrapper to the cordova file plugin.
// Contains methods to read/write folders and files into the persistent file storage.
// Ref: https://github.com/tonyhursh/gapfile/blob/master/www/gapfile.js
define(['jquery'], function ($) {

  'use strict';

  var root = '/';

  var extractDirectory = function (path) {
    var dirPath,
      lastSlash = path.lastIndexOf('/');

    /*jslint eqeqeq:true*/
    if (lastSlash == -1) {
      dirPath = root;
    } else {
      dirPath = path.substring(0, lastSlash);

      if (dirPath === '') {
        dirPath = root;
      }
    }

    return dirPath;
  };

  var extractFile = function (path) {
    var lastSlash = path.lastIndexOf('/');

    /*jslint eqeqeq:true*/
    if (lastSlash == -1) {
      return path;
    }

    var filename = path.substring(lastSlash + 1);

    return filename;
  };

  return {
    getFileSystem: function () {
      var d = $.Deferred();
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, d.resolve, d.reject);
      return d.promise();
    },

    getDirectory: function (name, options) {
      var d = $.Deferred();

      this.getFileSystem().then(function (fS) {
        fS.root.getDirectory(name, options, d.resolve, d.reject);
      }, d.reject);

      return d.promise();
    },

    createDirectory: function (name) {
      return this.getDirectory(name, {
        create: true,
        exclusive: false
      });
    },

    removeDirectory: function (name) {
      var d = $.Deferred();

      this.getDirectory(name, {
        create: false,
        exclusive: false
      }).then(function (dirEntry) {
        dirEntry.removeRecursively(d.resolve, d.reject);
      }, d.reject);

      return d.promise();
    },

    getFile: function (path, dirOptions, fileOptions) {
      var d = $.Deferred();

      this.getDirectory(extractDirectory(path), dirOptions).then(function (dirEntry) {
        dirEntry.getFile(extractFile(path), fileOptions, d.resolve, d.reject);
      }, d.reject);

      return d.promise();
    },

    writeToFile: function (path, data, append) {
      var d = $.Deferred();

      this.getFile(path, {
        create: true,
        exclusive: false
      }, {
        create: true
      }).then(function (fileEntry) {
        var fileURL = fileEntry.toURL();
        fileEntry.createWriter(
          function (writer) {

            writer.onwrite = function () {
              d.resolve(fileURL);
            };

            writer.onerror = d.reject;

            if (append === true) {
              writer.seek(writer.length);
            }

            writer.write(data);
          }, d.reject);
      }, d.reject);

      return d.promise();
    },

    readFromFile: function (path, asText) {
      var d = $.Deferred();

      this.getFile(path, {
        create: false,
        exclusive: false
      }, {
        create: false
      }).then(function (fileEntry) {
        fileEntry.file(function (file) {

          var reader = new FileReader();

          reader.onloadend = function (evt) {
            d.resolve(evt.target.result);
          };

          reader.onerror = d.reject;

          if (asText === true) {
            reader.readAsText(file);
          } else {
            reader.readAsDataURL(file);
          }
        }, d.reject);
      });

      return d.promise();
    },

    deleteFile: function (path) {
      var d = $.Deferred();

      this.getFile(path, {
        create: false,
        exclusive: false
      }, {
        create: false
      }).then(function (fileEntry) {
        fileEntry.remove(d.resolve, d.reject);
      }, d.reject);

      return d.promise();
    }
  };
});
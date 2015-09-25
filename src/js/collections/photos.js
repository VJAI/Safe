define(['backbone', 'models/photo', 'backbonelocalstorage'], function (Backbone, Photo) {

  'use strict';

  // Represent collection of photos.
  var Photos = Backbone.Collection.extend({

    // Use localstorage for persistence.
    localStorage: new Backbone.LocalStorage('secret-photos'),

    model: Photo,

    // Sort the photos in descending order by 'lastSaved' date.
    comparator: function(photo) {
      var lastSavedDate = new Date(photo.get('lastSaved'));
      return -lastSavedDate.getTime();
    },

    // Text search by 'description'.
    search: function (text) {
      if(!text) {
        return this.models;
      }

      return this.filter(function (photo) {
        return photo.get('description').toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
    }
  });

  return Photos;
});

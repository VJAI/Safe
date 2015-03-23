define(['backbone'], function (Backbone) {

  'use strict';

  // Model that represents the meta-data information of the secret photo. 
  // Contains properties to represent description, thumbnail and last-saved-date.
  var Photo = Backbone.Model.extend({
     
    // Properties (attributes)
    defaults: {
      description: null,
      thumbnail: null,
      lastSaved: Date()
    },

    // Validation rules.
    validation: {
      description: {
        required: true
      },
      thumbnail: {
        required: true
      }
    }
  });

  return Photo;
});
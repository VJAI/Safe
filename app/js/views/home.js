define([
  'underscore',
  'backbone',
  'adapters/notification',
  'views/photos',
  'templates'
], function (
  _,
  Backbone,
  notification,
  PhotosView,
  templates
) {

  'use strict';

  // Home view.
  // Renders the home view that displays the list of all secrets and handles the UI logic associated with it.
  var Home = Backbone.View.extend({

    // Set the template.
    template: templates.home,
    
    // Set the bindings.
    bindings: {
      '#search': 'search'
    },

    initialize: function () {
      
      // Throw error if photos collection not passed.
      if(!this.collection) {
        throw new Error('collection is required');
      }
      
      // Throw error if model is not passed.
      if(!this.model) {
        throw new Error('model is required');
      }
      
      // We need this collection because of search.
      this.filtered = new Backbone.Collection(this.collection.models);

      // Instantiate the child view that displays the photos list passing the collection.
      this.listView = new PhotosView({
        collection: this.filtered
      });

      // Run search whenever user type or change text in the search textbox.
      this.listenTo(this.model, 'change:search', this.searchPhotos);

      // Update the count label.
      this.listenTo(this.model, 'change:total', this.updateLabel);
    },

    render: function () {   
      // Render the outer container.
      this.$el.html(this.template(this.model.toJSON()));
      
      // Bind the model props to DOM.
      this.stickit();
      
      // Render the child list view.
      this.$('#list-container').append(this.listView.render().el);
      
      // Cache the DOM els for quick access.
      this.$total = this.$('#total');      
    
      return this;
    },

    searchPhotos: function () {
      var filteredCollection = this.collection.search((this.model.get('search') || '').trim());
      this.model.set('total', filteredCollection.length);
      this.filtered.reset(filteredCollection);
    },

    updateLabel: function () {
      var total = this.model.get('total'),
        message = '';

      if (total > 0) {
        message = total + ' photo(s) found';
      } else {
        message = 'No photos found';
      }

      this.$total.html(message);
    }
  });

  return Home;
});
define(['underscore', 'backbone', 'views/photoitem'], function (_, Backbone, PhotoItemView) {

  'use strict';

  // Photos list view.
  var Photos = Backbone.View.extend({

    tagName: 'ul',

    className: 'table-view',

    initialize: function () {
      this.childViews = [];
      this.listenTo(this.collection, 'reset', this.refresh);
    },

    render: function () {
      // Iterate through the collection, construct and render the photoitemview for each item.
      this.collection.each(_.bind(function (model) {
        var photoItemView = new PhotoItemView({
          model: model
        });
        
        this.childViews.push(photoItemView);
        this.$el.append(photoItemView.render().el);
      }, this));

      return this;
    },

    // Remove the child views and re-render the collection.
    refresh: function () {
      _.each(this.childViews, function(childView) {
        childView.remove();
      });
      
      this.render();
    }
  });

  return Photos;
});
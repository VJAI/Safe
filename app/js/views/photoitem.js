define(['backbone', 'templates'], function(Backbone, templates) {
  
  'use strict';
  
  // Photo item view.
  var PhotoItemView = Backbone.View.extend({
    
    tagName: 'li',    
    
    className: 'table-view-cell media',
    
    template: templates.photoitem,
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
  
  return PhotoItemView;
});
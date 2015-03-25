define(['backbone', 'templates'], function(Backbone, templates) {
  
  'use strict';
  
  // Settings view.
  var SettingsView = Backbone.View.extend({
  
    template: templates.settings,
    
    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
  
  return SettingsView;
});
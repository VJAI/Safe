define(['underscore', 'backbone', 'session', 'templates'], function (_, Backbone, session, templates) {

  'use strict';

  // Info view.
  var InfoView = Backbone.View.extend({

    template: templates.info,
  
    render: function () {
      var isAuthenticated = session.retrieve('state') === 'LOGGED_IN';

      this.$el.html(this.template({
        isAuthenticated: isAuthenticated,
        backToUrl: !isAuthenticated ? '#login' : null
      }));

      return this;
    }
  });

  return InfoView;
});
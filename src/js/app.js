// Startup module.
define(['backbone', 'extensions', 'session'], function (Backbone, session) {

  'use strict';

  // Starts the backbone routing.
  function startHistory() {
    Backbone.history.start();
  }

  return {
    
    // Add extension methods and start app on device ready.
    start: function (isDevice) {

      // If the app is running in device, run the startup code in the 'deviceready' event else on document ready.
      if (isDevice) {
        document.addEventListener('deviceready', function() {
          
          // Clear the session when the app moves to background.
          document.addEventListener('pause', function() {
            session.clear();
          }, false);
          
          startHistory();
        }, false);
      } else {
        $(startHistory);
      }
    }
  };
});
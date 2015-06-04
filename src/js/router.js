// Custom backbone router.
// Define all routes and methods to handle them.
// **I wish backbone should have CONTROLLERS!
define([
  'jquery',
  'underscore',
  'backbone',
  'keychain',
  'adapters/notification',
  'adapters/crypto',
  'adapters/persistentfilestorage',
  'data',
  'models/credential',
  'models/photo',
  'models/file',
  'collections/photos',
  'session',
  'views/register',
  'views/login',
  'views/forgotpassword',
  'views/changepassword',
  'views/changesecurityinfo',
  'views/home',
  'views/addedit',
  'views/photo',
  'views/info',
  'views/settings'
], function (
  $,
  _,
  Backbone,
  keychain,
  notification,
  crypto,
  persistentfilestorage,
  Data,
  Credential,
  Photo,
  File,
  Photos,
  session,
  RegisterView,
  LoginView,
  ForgotPasswordView,
  ChangePasswordView,
  ChangeSecurityInfoView,
  HomeView,
  AddEditView,
  PhotoView,
  InfoView,
  SettingsView
) {

  'use strict';

  // Array that maps the user state to allowed/not-allowed routes and default one.
  var stateRouteMapArray = [
    {
      state: 'NOT_REGISTERED',
      allowed: 'register|info',
      default: 'register'
    },
    {
      state: 'LOGGED_OUT',
      allowed: 'login|forgotpassword|info',
      default: 'login'
    },
    {
      state: 'VERIFIED',
      allowed: 'changepassword|info|login',
      default: 'changepassword'
    },
    {
      state: 'LOGGED_IN',
      notallowed: 'register|login|forgotpassword',
      default: 'photos'
    }
  ];

  // Returns the route that the user should be directed to.
  var whereToGo = function (state, route) {

    // Get the map object for the user state.
    var stateRouteMap = _.find(stateRouteMapArray, {
      state: state
    });

    var routes = (stateRouteMap.allowed || stateRouteMap.notallowed).split('|'),
      toGo;
    var containsRoute = _.contains(routes, route);

    if (stateRouteMap.allowed) {
      toGo = containsRoute ? route : stateRouteMap.default;
    } else {
      toGo = containsRoute ? stateRouteMap.default : route;
    }

    return toGo;
  };

  var currentView, // Represents the current view
    photos; // Collection of photos

  // The router.
  var Router = Backbone.Router.extend({

    routes: {
      '': 'photos',
      'photos': 'photos',
      'login': 'login',
      'logout': 'logout',
      'register': 'register',
      'forgotpassword': 'forgotPassword',
      'changepassword': 'changePassword',
      'changesecurityinfo': 'changesecurityinfo',
      'photos/:id': 'photo',
      'add': 'add',
      'edit/:id': 'edit',
      'info': 'info',
      'settings': 'settings'
    },

    // Fetch the photos collection and render the view.
    photos: function () {
      this.getPhotos()
        .done(_.bind(function () {
          this.renderView(new HomeView({
            model: new Backbone.Model({
              search: '',
              total: photos.length
            }),
            collection: photos
          }));
        }, this))
        .fail(function () {
          notification.alert('Failed to retrieve photos. Please try again.', 'Error', 'Ok');
        });
    },

    // Renders the login view.
    login: function () {
      this.renderView(new LoginView({
        model: new Credential(),
        credential: new Credential({
          id: 'Safe-Credential'
        })
      }));
    },

    // Logs out the user and redirect to login.
    logout: function () {
      session.clear();
      this.navigate('#login', true);
    },

    // Renders the register view.
    register: function () {
      this.renderView(new RegisterView({
        model: new Credential({
          id: 'Safe-Credential'
        }),
        securityQuestions: Data.securityQuestions
      }));
    },

    // Renders the forgot password view.
    forgotPassword: function () {
      var credential = new Credential({
        id: 'Safe-Credential'
      });

      credential.fetch()
        .done(_.bind(function () {
          this.renderView(new ForgotPasswordView({
            model: new Credential({
              securityQuestion: credential.get('securityQuestion')
            }),
            credential: credential
          }));
        }, this))
        .fail(function () {
          notification.alert('Failed to retrieve security info. Please try again.', 'Error', 'Ok');
        });
    },

    // Renders the change password view.
    changePassword: function () {
      this.renderView(new ChangePasswordView({
        model: new Credential(),
        credential: new Credential({
          id: 'Safe-Credential'
        })
      }));
    },

    changesecurityinfo: function () {
      this.renderView(new ChangeSecurityInfoView({
        model: new Credential(),
        credential: new Credential({
          id: 'Safe-Credential'
        }),
        securityQuestions: Data.securityQuestions
      }));
    },

    // Renders the photo view.
    photo: function (id) {
      this.getPhotos()
        .done(_.bind(function () {
          var photo = photos.get(id);

          if (!photo) {
            notification.alert('Photo not exists.', 'Error', 'Ok');
            return;
          }

          this.renderView(new PhotoView({
            model: photo,
            file: new File({
              id: id
            })
          }));
        }, this))
        .fail(function () {
          notification.alert('Failed to retrieve photo. Please try again.', 'Error', 'Ok');
        });
    },

    // Renders the view to add photo.
    add: function () {
      this.getPhotos()
        .done(_.bind(function () {
          this.renderView(new AddEditView({
            model: new Photo(),
            file: new File(),
            collection: photos
          }));
        }, this))
        .fail(function () {
          notification.alert('Error occured while retrieving the associated collection. Please try again.', 'Error', 'Ok');
        });
    },

    // Gets the photo model and renders the view to edit photo.
    edit: function (id) {
      this.getPhotos()
        .done(_.bind(function () {
          var photo = photos.get(id);

          if (!photo) {
            notification.alert('Photo not exists.', 'Error', 'Ok');
            return;
          }

          this.renderView(new AddEditView({
            model: photo,
            file: new File({
              id: id
            })
          }));
        }, this))
        .fail(function () {
          notification.alert('Failed to retrieve photo. Please try again.', 'Error', 'Ok');
        });
    },

    // Renders the info view.
    info: function () {
      this.renderView(new InfoView());
    },

    // Renders the settings view.
    settings: function () {
      this.renderView(new SettingsView());
    },

    getPhotos: function () {
      var d = $.Deferred();

      if (photos) {
        photos.sort();
        d.resolve(photos);
      } else {
        photos = new Photos();
        photos.fetch().done(d.resolve).fail(d.reject);
      }

      return d.promise();
    },

    renderView: function (view) {
      if (currentView) {
        currentView.ghost();
      }

      currentView = view;
      currentView.setElement($('body'));
      currentView.render();
    },

    // Override the 'route' method to prevent unauthorized access.
    // before directing the routes to their corresponding methods.
    // Ref: http://stackoverflow.com/questions/13970699/backbone-js-force-to-login-route
    route: function (route, name, callback) {

      if (!_.isRegExp(route)) {
        route = this._routeToRegExp(route);
      }

      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }

      if (!callback) {
        callback = this[name];
      }

      // here my custom code
      callback = _.wrap(callback, _.bind(function (cb, args) {

        var state = session.retrieve('state'),
          fn = function () {
            if (state === 'VERIFIED') {
              session.store('state', 'LOGGED_OUT');
            }

            // Get the page the user should navigate to.
            // 'name' is the handler of the particular route.
            var goto = whereToGo(state, name.toLowerCase());

            if (goto.toLowerCase() === name.toLowerCase()) {
              _.bind(cb, this)(args);
            } else {
              this.navigate(goto, true);
            }
          };

        if (!state) {
          state = keychain.containsKey('Safe-Credential') ? 'LOGGED_OUT' : 'NOT_REGISTERED';
          session.store('state', state);
        }

        fn.call(this);
      }, this));

      var router = this;

      Backbone.history.route(route, function (fragment) {
        var args = router._extractParameters(route, fragment);

        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
        }
      });

      return this;
    }
  });

  return new Router();
});

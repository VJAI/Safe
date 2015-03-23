define([
  'jquery',
  'underscore',
  'extensions',
  'adapters/notification',
  'models/photo',
  'models/file',
  'views/photo',
  'templates'
], function (
  $,
  _,
  extensions,
  notification,
  Photo,
  File,
  PhotoView,
  templates
) {

  'use strict';

  describe('photo view', function () {

    var view, model, file;

    beforeEach(function () {

      spyOn(notification, 'alert').and.callFake(function () {
        return _.resolve();
      });

      model = new Photo({
        id: '1',
        description: 'River-side property document',
        thumbnail: '[thumbnail]',
        lastSaved: 'Fri Mar 06 2015 18:10:23 GMT+0530 (India Standard Time)'
      });

      file = new File({
        id: model.id
      });

      view = new PhotoView({
        model: model,
        file: file
      });
    });

    afterEach(function () {
      if (view) {
        view.remove();
      }
    });

    describe('when constructed', function () {

      describe('without model', function () {
        it('should throw error', function () {
          expect(function () {
            new PhotoView();
          }).toThrow(new Error('model is required'));
        });
      });

      describe('without file model', function () {
        it('should throw error', function () {
          expect(function () {
            new PhotoView({
              model: model
            });
          }).toThrow(new Error('file is required'));
        });
      });

      describe('with required arguments', function () {
        it('should exist with properties initialized', function () {
          expect(view).toBeDefined();
          expect(view.model).toBe(model);
          expect(view.file).toBe(file);
          expect(view.template).toBe(templates.photo);
        });
      });
    });

    describe('when rendered', function () {

      beforeEach(function () {
        spyOn(file, 'fetch').and.callFake(function () {
          return _.resolve();
        });
        view.render();
      });

      it('should display description', function () {
        expect(view.$el.find('.description')).toHaveText(model.get('description'));
      });
    });

    describe('when failed to load the image', function () {

      beforeEach(function () {
        spyOn(file, 'fetch').and.callFake(function () {
          var d = $.Deferred();
          d.reject();
          return d.promise();
        });

        view.render();
      });

      it('should alert the error to the user', function () {
        expect(notification.alert).toHaveBeenCalledWith('Failed to load image. Please try again.', 'Error', 'Ok');
      });
    });

    describe('when sucessfully loading the image', function () {

      var base64Image = '[SOME CRAZY IMAGE]';

      beforeEach(function () {
        spyOn(file, 'fetch').and.callFake(function () {
          var d = $.Deferred();
          file.set('data', base64Image);
          d.resolve();
          return d.promise();
        });

        view.render();
      });

      it('should update the base 64 string in the image tag', function () {
        expect(view.$el.find('#photo')).toHaveAttr('src', 'data:image/png;base64,' + base64Image);
      });
    });
  });
});

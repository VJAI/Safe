define([
  'jquery',
  'backbone',
  'extensions',
  'adapters/notification',
  'models/photo',
  'collections/photos',
  'views/home',
  'templates'
], function (
  $,
  Backbone,
  extensions,
  notification,
  Photo,
  Photos,
  HomeView,
  templates
) {

  'use strict';

  describe('home view', function () {

    var view, collection, model;

    beforeEach(function () {
      collection = new Photos([
        new Photo({
          description: 'HDFC Bank CreditCard',
          thumbnail: 'somecrazybase64string1...',
          lastSaved: 'Wed Mar 10 2015 13:15:34 GMT+0530 (India Standard Time)'
        }),
        new Photo({
          description: 'ICICI CreditCard',
          thumbnail: 'somecrazybase64string2...',
          lastSaved: 'Wed Mar 11 2015 13:15:34 GMT+0530 (India Standard Time)'
        })
      ]);

      model = new Backbone.Model({
        search: '',
        total: collection.length
      });

      view = new HomeView({
        collection: collection,
        model: model
      });
    });

    afterEach(function () {
      if (view) {
        view.remove();
      }
    });

    describe('when constructed', function () {

      describe('without collection', function () {
        it('should throw error', function () {
          expect(function () {
            new HomeView();
          }).toThrow(new Error('collection is required'));
        });
      });

      describe('without model', function () {
        it('should throw error', function () {
          expect(function () {
            new HomeView({
              collection: new Photos()
            });
          }).toThrow(new Error('model is required'));
        });
      });

      describe('with required arguments', function () {
        it('should exist with properties initialized', function () {
          expect(view).toBeDefined();
          expect(view.collection).toBe(collection);
          expect(view.model).toBe(model);
          expect(view.template).toBe(templates.home);
        });
      });

    });

    describe('when rendered', function () {

      describe('with empty collection', function () {

        beforeEach(function () {
          view = new HomeView({
            collection: new Photos(),
            model: new Backbone.Model({
              search: '',
              total: 0
            })
          });

          view.render();
        });

        it('should not display search form', function () {
          expect(view.$el).not.toContainElement('#search-form');
        });

        it('should display total photos count', function () {
          expect(view.$el.find('#total')).toHaveText('No photos found');
        });

        it('should contain the list empty', function () {
          expect(view.$el.find('#list-container ul')).toBeEmpty();
        });
      });

      describe('with non-empty collection', function () {

        beforeEach(function () {
          view.render();
        });

        it('should display search form', function () {
          expect(view.$el).toContainElement('#search-form');
        });

        it('should display total photos count', function () {
          expect(view.$el.find('#total')).toHaveText('2 photo(s) found');
        });

        it('should contain the list with the items', function () {
          expect(view.$el.find('#list-container ul')).not.toBeEmpty();
          expect(view.$el.find('#list-container ul li').length).toBe(2);
        });
      });
    });

    describe('when changes', function () {

      beforeEach(function () {
        view.render();
      });

      describe('with search text that not matches', function () {

        beforeEach(function () {
          view.$el.find('#search').val('photo').trigger('change');
        });

        it('should clear the list', function () {
          expect(view.$el.find('#list-container ul')).toBeEmpty();
        });

        it('should update the total text', function () {
          expect(view.$el.find('#total')).toHaveText('No photos found');
        });
      });

      describe('with search text that matches', function () {

        beforeEach(function () {
          view.$el.find('#search').val('hdfc').trigger('change');
        });

        it('should update the list', function () {
          expect(view.$el.find('#list-container ul li').length).toBe(1);
        });

        it('should update the total text', function () {
          expect(view.$el.find('#total')).toHaveText('1 photo(s) found');
        });
      });

      describe('with empty search text', function () {

        beforeEach(function () {
          view.$el.find('#search').val('').trigger('change');
        });

        it('should re-render the list with all items', function () {
          expect(view.$el.find('#list-container ul li').length).toBe(2);
        });

        it('should update the total text', function () {
          expect(view.$el.find('#total')).toHaveText('2 photo(s) found');
        });
      });
    });
  });

});
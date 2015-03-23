define([
  'jquery',
  'underscore',
  'extensions',
  'adapters/camera',
  'adapters/imageresizer',
  'adapters/notification',
  'models/photo',
  'models/file',
  'collections/photos',
  'views/addedit',
  'templates'
], function (
  $,
  _,
  extensions,
  camera,
  imageresizer,
  notification,
  Photo,
  File,
  Photos,
  AddEditView,
  templates
) {

  'use strict';

  describe('addedit view', function () {

    var view, model, collection, file;

    beforeEach(function () {
      spyOn(notification, 'alert').and.callFake(function () {
        return _.resolve();
      });

      model = new Photo();

      file = new File();

      collection = new Photos();

      view = new AddEditView({
        model: model,
        file: file,
        collection: collection
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
            new AddEditView();
          }).toThrow(new Error('model is required'));
        });
      });

      describe('without file model', function () {
        it('should throw error', function () {
          expect(function () {
            new AddEditView({
              model: new Photo()
            });
          }).toThrow(new Error('file is required'));
        });
      });

      describe('without collection', function () {
        it('should throw error', function () {
          expect(function () {
            new AddEditView({
              model: new Photo(),
              file: new File()
            });
          }).toThrow(new Error('collection is required'));
        });
      });

      describe('with required arguments', function () {
        it('should exist with properties initialized', function () {
          expect(view).toBeDefined();
          expect(view.model).toBe(model);
          expect(view.file).toBe(file);
          expect(view.template).toBe(templates.addedit);
        });
      });

      describe('for add a new photo', function () {
        it('should have the isEdit property as false', function () {
          expect(view.isEdit).toBe(false);
        });
      });

      describe('for edit an existing photo', function () {

        beforeEach(function () {
          view = new AddEditView({
            model: new Photo({
              id: '1'
            }),
            file: new File({
              id: '1'
            })
          });
        });

        it('should have the isEdit property as true', function () {
          expect(view.isEdit).toBe(true);
        });
      });
    });

    describe('when rendered for add photo', function () {

      beforeEach(function () {
        view.render();
      });

      it('should contain the title as Add Photo', function () {
        expect(view.$el.find('.title')).toHaveText('Add Photo');
      });

      it('should contain description textbox empty with maxlength 25', function () {
        var $description = view.$el.find('#description');

        expect($description).toHaveValue('');
        expect($description).toHaveAttr('maxlength', '25');
      });

      it('should contain the image pointing to placeholder.png', function () {
        expect(view.$el.find('#photo')).toHaveAttr('src', 'images/placeholder.png');
      });

      it('should not contain the delete button', function () {
        expect(view.$el).not.toContainElement('#delete');
      });
    });

    describe('when rendered to edit photo', function () {

      beforeEach(function () {
        model = new Photo({
          id: '1',
          description: 'River-side property document',
          thumbnail: '[some crazy thumbnail]',
          lastSaved: 'Fri Mar 06 2015 18:10:23 GMT+0530 (India Standard Time)'
        });

        file = new File({
          id: model.id
        });

        view = new AddEditView({
          model: model,
          file: file
        });
      });

      describe('with file fetch failed', function () {

        beforeEach(function () {
          spyOn(file, 'fetch').and.callFake(function () {
            return _.reject();
          });

          view.render();
        });

        it('should contain the title as Edit Photo', function () {
          expect(view.$el.find('.title')).toHaveText('Edit Photo');
        });

        it('should contain description textbox filled', function () {
          expect(view.$el.find('#description')).toHaveValue(model.get('description'));
        });

        it('should contain the delete button', function () {
          expect(view.$el).toContainElement('#delete');
        });

        it('should contain the image src set to thumbnail', function () {
          expect(view.$el.find('#photo')).toHaveAttr('src', 'data:image/png;base64,' + model.get('thumbnail'));
        });

        it('should notify the user about the failure', function () {
          expect(notification.alert).toHaveBeenCalledWith('Failed to load image. Please try again.', 'Error', 'Ok');
        });
      });

      describe('with file fetch succeeded', function () {

        var base64Image = '[SOME CRAZY IMAGE]';

        beforeEach(function () {
          spyOn(file, 'fetch').and.callFake(function () {
            file.set('data', base64Image);
            return _.resolve();
          });

          view.render();
        });

        it('should contain the image src set to the actual image\'s base64', function () {
          expect(view.$el.find('#photo')).toHaveAttr('src', 'data:image/png;base64,' + base64Image);
        });
      });
    });

    describe('when changes', function () {

      beforeEach(function () {
        view.render();
      });

      describe('by user selecting a new photo from library', function () {

        beforeEach(function () {

          spyOn(camera, 'getPictureFromLibrary').and.callFake(function () {
            return _.resolve('[SOME CRAZY BASE64 STRING]');
          });

          spyOn(imageresizer, 'resize').and.callFake(function () {
            return _.resolve({
              imageData: '[some crazy base64 thumbnail]'
            });
          });

          view.addPhoto({
            preventDefault: $.noop
          });
        });

        it('should update the data property of file model', function () {
          expect(view.file.get('data')).toBe('[SOME CRAZY BASE64 STRING]');
        });

        it('should update the image tag', function () {
          expect(view.$el.find('#photo')).toHaveAttr('src', 'data:image/png;base64,[SOME CRAZY BASE64 STRING]');
        });

        it('should resize the image', function () {
          expect(imageresizer.resize).toHaveBeenCalledWith('[SOME CRAZY BASE64 STRING]', 42, 0);
        });

        it('should update the thumbnail property of photo model', function () {
          expect(view.model.get('thumbnail')).toBe('[some crazy base64 thumbnail]');
        });

        it('the save button should stay disabled', function () {
          expect(view.$el.find('#save')).toBeDisabled();
        });
      });

      describe('by adding text to description textbox', function () {

        beforeEach(function () {
          view.$el.find('#description').val('HDFC CreditCard').trigger('change');
        });

        it('should update the description property', function () {
          expect(view.model.get('description')).toBe('HDFC CreditCard');
        });

        it('the save button should stay disabled', function () {
          expect(view.$el.find('#save')).toBeDisabled();
        });
      });

      describe('by filling all the fields', function () {

        beforeEach(function () {

          spyOn(camera, 'getPictureFromLibrary').and.callFake(function () {
            return _.resolve('[SOME CRAZY BASE64 STRING]');
          });

          spyOn(imageresizer, 'resize').and.callFake(function () {
            return _.resolve({
              imageData: '[some crazy base64 thumbnail]'
            });
          });

          view.addPhoto({
            preventDefault: $.noop
          });

          view.$el.find('#description').val('HDFC CreditCard').trigger('change');
        });

        it('should enable the done button', function () {
          expect(view.$el.find('#save')).not.toBeDisabled();
        });
      });

      describe('by submitting form', function () {

        describe('without all fields filled', function () {

          beforeEach(function () {
            spyOn(view.model, 'save');
            spyOn(view.collection, 'create');

            view.$el.find('#description').val('HDFC CreditCard').trigger('change');
            view.$el.find('#addedit-form').trigger('submit');
          });

          it('should alert error', function () {
            expect(notification.alert).toHaveBeenCalledWith('Some of the required fields are missing.', 'Error', 'Ok');
          });

          it('should not call model.save', function () {
            expect(view.model.save).not.toHaveBeenCalled();
          });

          it('should not call collection.create', function () {
            expect(view.collection.create).not.toHaveBeenCalled();
          });
        });

        describe('with all fields filled', function () {

          beforeEach(function () {
            spyOn(camera, 'getPictureFromLibrary').and.callFake(function () {
              return _.resolve('[SOME CRAZY BASE64 STRING]');
            });

            spyOn(imageresizer, 'resize').and.callFake(function () {
              return _.resolve({
                imageData: '[some crazy base64 thumbnail]'
              });
            });

            view.addPhoto({
              preventDefault: $.noop
            });

            view.$el.find('#description').val('HDFC CreditCard').trigger('change');
          });

          describe('and failed to create', function () {

            beforeEach(function () {
              spyOn(view.collection, 'create').and.callFake(function (model, options) {
                options.error();
              });

              view.$el.find('#addedit-form').trigger('submit');
            });

            it('should alert error', function () {
              expect(notification.alert).toHaveBeenCalledWith('Failed to save photo. Please try again.', 'Error', 'Ok');
            });

            it('should enable the done button', function () {
              expect(view.$el.find('#save')).not.toBeDisabled();
            });
          });

          describe('and failed to persist file', function () {

            beforeEach(function () {
              spyOn(view.collection, 'create').and.callFake(function (model, options) {
                options.success();
              });

              spyOn(view.file, 'save').and.callFake(function () {
                return _.reject();
              });

              view.$el.find('#addedit-form').trigger('submit');
            });

            it('should alert error', function () {
              expect(notification.alert).toHaveBeenCalledWith('Failed to save photo. Please try again.', 'Error', 'Ok');
            });

            it('should enable the done button', function () {
              expect(view.$el.find('#save')).not.toBeDisabled();
            });
          });

          describe('and succeeded to create', function () {

            beforeEach(function () {
              spyOn(view.collection, 'create').and.callFake(function (model, options) {
                options.success();
              });

              spyOn(view.file, 'save').and.callFake(function () {
                return _.resolve();
              });

              spyOn(view, 'navigateTo');

              view.$el.find('#addedit-form').trigger('submit');
            });

            it('should rnavigate back to photos page', function () {
              expect(view.navigateTo).toHaveBeenCalledWith('#photos');
            });
          });

        });
      });
    });

    describe('when changes in edit', function () {

      beforeEach(function () {
        model = new Photo({
          id: '1',
          description: 'River-side property document',
          thumbnail: '[thumbnail]',
          lastSaved: 'Fri Mar 06 2015 18:10:23 GMT+0530 (India Standard Time)'
        });

        file = new File({
          id: model.id
        });

        view = new AddEditView({
          model: model,
          file: file
        });

        spyOn(view.file, 'fetch').and.callFake(function () {
          view.file.set('data', '[persisted base64 image]');
          return _.resolve();
        });

        view.render();
      });

      describe('by submitting form', function () {

        describe('and failed to save', function () {

          beforeEach(function () {
            spyOn(view.model, 'save').and.callFake(function () {
              return _.reject();
            });

            view.$el.find('#addedit-form').trigger('submit');
          });

          it('should alert error', function () {
            expect(notification.alert).toHaveBeenCalledWith('Failed to save photo. Please try again.', 'Error', 'Ok');
          });

          it('should enable the done button', function () {
            expect(view.$el.find('#save')).not.toBeDisabled();
          });
        });

        describe('and succeeded to save', function () {

          beforeEach(function () {
            spyOn(view.model, 'save').and.callFake(function () {
              return _.resolve();
            });

            spyOn(view.file, 'save').and.callFake(function () {
              return _.resolve();
            });

            spyOn(view, 'navigateTo');

            view.$el.find('#addedit-form').trigger('submit');
          });

          it('should navigate back to the photo page', function () {
            expect(view.navigateTo).toHaveBeenCalledWith('#photos/' + model.id);
          });
        });
      });

      describe('by clicking the delete button', function () {

        describe('and not confirm', function () {

          beforeEach(function () {
            spyOn(notification, 'confirm').and.callFake(function () {
              return _.resolve(0);
            });

            spyOn(view.file, 'destroy');
            spyOn(view.model, 'destroy');

            view.delete();
          });

          it('should not call destroy file', function () {
            expect(view.file.destroy).not.toHaveBeenCalled();
          });

          it('should not call destroy model', function () {
            expect(view.model.destroy).not.toHaveBeenCalled();
          });

          it('should enable back the delete button', function () {
            expect(view.$el.find('#delete')).not.toBeDisabled();
          });
        });

        describe('and confirm', function () {

          beforeEach(function () {
            spyOn(notification, 'confirm').and.callFake(function () {
              return _.resolve(1);
            });
          });

          describe('and on failed to delete file', function () {

            beforeEach(function () {
              spyOn(view.file, 'destroy').and.callFake(function () {
                return _.reject();
              });

              spyOn(view.model, 'destroy');

              view.delete();
            });

            it('should alert notification', function () {
              expect(notification.alert).toHaveBeenCalledWith('Failed to delete. Please try again.', 'Error', 'Ok');
            });

            it('should enable back the delete button', function () {
              expect(view.$el.find('#delete')).not.toBeDisabled();
            });

            it('should not call destroy model', function () {
              expect(view.model.destroy).not.toHaveBeenCalled();
            });
          });

          describe('and on failed to delete model', function () {

            beforeEach(function () {
              spyOn(view.file, 'destroy').and.callFake(function () {
                return _.resolve();
              });

              spyOn(view.model, 'destroy').and.callFake(function () {
                return _.reject();
              });

              view.delete();
            });

            it('should alert notification', function () {
              expect(notification.alert).toHaveBeenCalledWith('Failed to delete. Please try again.', 'Error', 'Ok');
            });

            it('should enable back the delete button', function () {
              expect(view.$el.find('#delete')).not.toBeDisabled();
            });
          });

          describe('and on success delete', function () {

            beforeEach(function () {
              spyOn(view.file, 'destroy').and.callFake(function () {
                return _.resolve();
              });

              spyOn(view.model, 'destroy').and.callFake(function () {
                return _.resolve();
              });

              spyOn(view, 'navigateTo');

              view.delete();
            });

            it('should call destroy file', function () {
              expect(view.file.destroy).toHaveBeenCalled();
            });

            it('should call destroy model', function () {
              expect(view.model.destroy).toHaveBeenCalled();
            });

            it('should navigate back to photos page', function () {
              expect(view.navigateTo).toHaveBeenCalledWith('#photos');
            });
          });

        });

      });
    });
  });
});

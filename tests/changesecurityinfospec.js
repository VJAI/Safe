define([
  'jquery',
  'underscore',
  'extensions',
  'adapters/notification',
  'models/credential',
  'views/changesecurityinfo',
  'templates'
], function (
  $,
  _,
  extensions,
  notification,
  Credential,
  ChangeSecurityInfoView,
  templates
) {

  'use strict';

  describe('changesecurityinfo view', function () {

    var view,
      model,
      credential,
      securityQuestions = ['Where is eiffel tower?', 'Who directed Titanic?', 'Test'];

    beforeEach(function () {
      spyOn(notification, 'alert').and.callFake(function () {
        return _.resolve();
      });

      model = new Credential();

      credential = new Credential({
        id: 'Safe-Credential'
      });

      view = new ChangeSecurityInfoView({
        model: model,
        credential: credential,
        securityQuestions: securityQuestions
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
            new ChangeSecurityInfoView();
          }).toThrow(new Error('model is required'));
        });
      });

      describe('without credential', function () {
        it('should throw error', function () {
          expect(function () {
            new ChangeSecurityInfoView({
              model: new Credential()
            });
          }).toThrow(new Error('credential is required'));
        });
      });

      describe('without security questions', function () {
        it('should throw error', function () {
          expect(function () {
            new ChangeSecurityInfoView({
              model: model,
              credential: new Credential()
            });
          }).toThrow(new Error('security questions required'));
        });
      });

      describe('with required arguments', function () {
        it('should exist with properties initialized', function () {
          expect(view).toBeDefined();
          expect(view.model).toBe(model);
          expect(view.credential).toBe(credential);
          expect(view.securityQuestions).toBe(securityQuestions);
          expect(view.template).toBe(templates.changesecurityinfo);
        });
      });

    });

    describe('when rendered', function () {

      beforeEach(function () {
        view.render();
      });

      it('should contain the security question dropdown selected', function () {
        expect(view.$el.find('#security-question option:eq(0)')).toBeSelected();
      });

      it('should contain the security answer filled', function () {
        expect(view.$el.find('#security-answer')).toHaveValue('');
      });

      it('should contain the change button disabled', function () {
        expect(view.$el.find('#save')).toBeDisabled();
      });
    });

    describe('when changes', function () {

      beforeEach(function () {
        view.render();
      });

      describe('with no security question is selected', function () {

        beforeEach(function () {
          view.$el.find('#security-question').val('Select a question').trigger('change');
        });

        it('then the answer textbox should be empty and disabled', function () {
          var $securityanswer = view.$el.find('#security-answer');

          expect($securityanswer).toHaveValue('');
          expect($securityanswer).toBeDisabled();
        });
      });

      describe('with security question is selected', function () {

        beforeEach(function () {
          view.$el.find('#security-question').val('Where is eiffel tower?').trigger('change');
        });

        it('then the answer textbox should be enabled', function () {
          expect(view.$el.find('#security-answer')).not.toBeDisabled();
        });
      });

      describe('with all fields not filled', function () {
        beforeEach(function () {
          view.$el.find('#security-question').val('Where is eiffel tower?').trigger('change');
        });

        it('then the save button should be disabled', function () {
          expect(view.$el.find('#save')).toBeDisabled();
        });
      });

      describe('with all fields filled', function () {

        beforeEach(function () {
          view.$el.find('#security-question').val('Where is eiffel tower?').trigger('change');
          view.$el.find('#security-answer').val('France').trigger('change');
        });

        it('then the save button should be enabled', function () {
          expect(view.$el.find('#save')).not.toBeDisabled();
        });
      });

      describe('when form is submitted', function () {

        describe('without all fields filled', function () {

          beforeEach(function () {
            view.$el.find('#security-question').val('Where is eiffel tower?').trigger('change');
            view.$el.find('#security-answer').val('').trigger('change');
            view.$el.find('#changesecurityinfo-form').trigger('submit');
          });

          it('should alert an error', function () {
            expect(notification.alert).toHaveBeenCalledWith('Submit security question with answer.', 'Error', 'Ok');
          });
        });

        describe('with all the fields filled', function () {

          beforeEach(function () {
            view.$el.find('#security-question').val('Where is eiffel tower?').trigger('change');
            view.$el.find('#security-answer').val('France').trigger('change');
          });

          describe('and failed to fetch', function () {

            beforeEach(function () {
              spyOn(view.credential, 'fetch').and.callFake(function () {
                return _.reject();
              });

              view.$el.find('#changesecurityinfo-form').trigger('submit');
            });

            it('should display notification', function () {
              expect(notification.alert).toHaveBeenCalledWith('Failed to change security info. Please try again.', 'Error', 'Ok');
            });

            it('should enable back the save button', function () {
              expect(view.$el.find('#save')).not.toBeDisabled();
            });
          });

          describe('and fetch succeeded', function () {

            beforeEach(function () {
              spyOn(view.credential, 'fetch').and.callFake(function () {
                view.credential.set({
                  password: 'S@f3',
                  key: '007',
                  securityQuestion: 'CODE WELCOME',
                  securityAnswer: 'CODE GET LOST'
                });

                return _.resolve();
              });
            });

            describe('and failed to save', function () {

              beforeEach(function () {
                spyOn(view.credential, 'save').and.callFake(function () {
                  return _.reject();
                });

                view.$el.find('#changesecurityinfo-form').trigger('submit');
              });

              it('should display notification', function () {
                expect(notification.alert).toHaveBeenCalledWith('Failed to change security info. Please try again.', 'Error', 'Ok');
              });

              it('should enable back the save button', function () {
                expect(view.$el.find('#save')).not.toBeDisabled();
              });
            });

            describe('and save succeeded', function () {

              beforeEach(function () {
                spyOn(view.credential, 'save').and.callFake(function () {
                  return _.resolve();
                });
                
                spyOn(view, 'navigateTo');

                view.$el.find('#changesecurityinfo-form').trigger('submit');
              });

              it('should navigate to settings page', function () {
                expect(view.navigateTo).toHaveBeenCalledWith('#settings');
              });
            });

          });

        });
      });
    });
  });
});
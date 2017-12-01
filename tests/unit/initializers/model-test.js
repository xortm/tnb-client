import Ember from 'ember';
import ModelInitializer from 'tiannianbao/initializers/model';
import Constants from 'tiannianbao/utils/constants';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | model', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
      window.Constants = Constants;
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  ModelInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});

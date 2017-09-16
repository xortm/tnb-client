import Ember from 'ember';
import ModelInitializer from 'callcloud/initializers/model';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | model', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  ModelInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});

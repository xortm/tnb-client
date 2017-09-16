import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('form-element/feedback-icon', 'Integration | Component | form element/feedback icon', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{form-element/feedback-icon}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#form-element/feedback-icon}}
      template block text
    {{/form-element/feedback-icon}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

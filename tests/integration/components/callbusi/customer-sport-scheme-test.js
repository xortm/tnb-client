import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/customer-sport-scheme', 'Integration | Component | callbusi/customer sport scheme', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/customer-sport-scheme}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/customer-sport-scheme}}
      template block text
    {{/callbusi/customer-sport-scheme}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/customer-diet-scheme', 'Integration | Component | callbusi/customer diet scheme', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/customer-diet-scheme}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/customer-diet-scheme}}
      template block text
    {{/callbusi/customer-diet-scheme}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

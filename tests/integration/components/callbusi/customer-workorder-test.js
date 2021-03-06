import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/customer-workorder', 'Integration | Component | callbusi/customer workorder', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{callbusi/customer-workorder}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#callbusi/customer-workorder}}
      template block text
    {{/callbusi/customer-workorder}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

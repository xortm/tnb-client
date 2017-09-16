import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/customer-list-item', 'Integration | Component | callbusi/customer list item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{callbusi/customer-list-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#callbusi/customer-list-item}}
      template block text
    {{/callbusi/customer-list-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

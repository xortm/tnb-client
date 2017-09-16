import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/customer-elderstate', 'Integration | Component | callbusi/customer elderstate', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/customer-elderstate}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/customer-elderstate}}
      template block text
    {{/callbusi/customer-elderstate}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

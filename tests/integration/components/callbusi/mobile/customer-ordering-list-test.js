import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/customer-ordering-list', 'Integration | Component | callbusi/mobile/customer ordering list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/customer-ordering-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/customer-ordering-list}}
      template block text
    {{/callbusi/mobile/customer-ordering-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

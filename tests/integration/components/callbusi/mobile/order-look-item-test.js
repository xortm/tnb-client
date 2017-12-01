import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/order-look-item', 'Integration | Component | callbusi/mobile/order look item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/order-look-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/order-look-item}}
      template block text
    {{/callbusi/mobile/order-look-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

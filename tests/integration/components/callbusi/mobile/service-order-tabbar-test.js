import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/service-order-tabbar', 'Integration | Component | callbusi/mobile/service order tabbar', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/service-order-tabbar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/service-order-tabbar}}
      template block text
    {{/callbusi/mobile/service-order-tabbar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

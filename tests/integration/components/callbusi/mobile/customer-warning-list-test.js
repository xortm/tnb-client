import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/customer-warning-list', 'Integration | Component | callbusi/mobile/customer warning list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/customer-warning-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/customer-warning-list}}
      template block text
    {{/callbusi/mobile/customer-warning-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

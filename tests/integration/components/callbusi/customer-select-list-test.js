import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/customer-select-list', 'Integration | Component | callbusi/customer select list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/customer-select-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/customer-select-list}}
      template block text
    {{/callbusi/customer-select-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

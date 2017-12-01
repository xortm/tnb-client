import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/customer-data-table', 'Integration | Component | callbusi/customer data table', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/customer-data-table}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/customer-data-table}}
      template block text
    {{/callbusi/customer-data-table}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

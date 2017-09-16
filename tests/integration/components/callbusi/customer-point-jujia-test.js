import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/customer-point-jujia', 'Integration | Component | callbusi/customer point jujia', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/customer-point-jujia}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/customer-point-jujia}}
      template block text
    {{/callbusi/customer-point-jujia}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

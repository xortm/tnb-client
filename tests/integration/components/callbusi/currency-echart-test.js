import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/currency-echart', 'Integration | Component | callbusi/currency echart', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/currency-echart}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/currency-echart}}
      template block text
    {{/callbusi/currency-echart}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

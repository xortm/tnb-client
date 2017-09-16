import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/scheme-medicine-list', 'Integration | Component | callbusi/scheme medicine list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/scheme-medicine-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/scheme-medicine-list}}
      template block text
    {{/callbusi/scheme-medicine-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

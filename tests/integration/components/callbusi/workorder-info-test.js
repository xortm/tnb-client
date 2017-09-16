import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/workorder-info', 'Integration | Component | callbusi/workorder info', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{callbusi/workorder-info}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#callbusi/workorder-info}}
      template block text
    {{/callbusi/workorder-info}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

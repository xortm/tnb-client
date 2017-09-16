import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/inner-navigation', 'Integration | Component | callbusi/mobile/inner navigation', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/inner-navigation}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/inner-navigation}}
      template block text
    {{/callbusi/mobile/inner-navigation}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

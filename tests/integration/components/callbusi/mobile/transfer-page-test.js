import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/transfer-page', 'Integration | Component | callbusi/mobile/transfer page', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/transfer-page}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/transfer-page}}
      template block text
    {{/callbusi/mobile/transfer-page}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

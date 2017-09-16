import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/evaluate-edit', 'Integration | Component | callbusi/mobile/evaluate edit', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/evaluate-edit}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/evaluate-edit}}
      template block text
    {{/callbusi/mobile/evaluate-edit}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

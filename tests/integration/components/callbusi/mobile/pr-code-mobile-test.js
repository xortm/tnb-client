import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/pr-code-mobile', 'Integration | Component | callbusi/mobile/pr code mobile', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/pr-code-mobile}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/pr-code-mobile}}
      template block text
    {{/callbusi/mobile/pr-code-mobile}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

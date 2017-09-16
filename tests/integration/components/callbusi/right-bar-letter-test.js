import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/right-bar-letter', 'Integration | Component | callbusi/right bar letter', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/right-bar-letter}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/right-bar-letter}}
      template block text
    {{/callbusi/right-bar-letter}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

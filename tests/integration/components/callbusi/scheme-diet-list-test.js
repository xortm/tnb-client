import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/scheme-diet-list', 'Integration | Component | callbusi/scheme diet list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/scheme-diet-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/scheme-diet-list}}
      template block text
    {{/callbusi/scheme-diet-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

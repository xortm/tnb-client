import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/scheme-medication-record', 'Integration | Component | callbusi/scheme medication record', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/scheme-medication-record}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/scheme-medication-record}}
      template block text
    {{/callbusi/scheme-medication-record}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

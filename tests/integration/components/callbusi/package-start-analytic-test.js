import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/package-start-analytic', 'Integration | Component | callbusi/package start analytic', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/package-start-analytic}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/package-start-analytic}}
      template block text
    {{/callbusi/package-start-analytic}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

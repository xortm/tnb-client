import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi\start-analytic', 'Integration | Component | callbusi\start analytic', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi\start-analytic}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi\start-analytic}}
      template block text
    {{/callbusi\start-analytic}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

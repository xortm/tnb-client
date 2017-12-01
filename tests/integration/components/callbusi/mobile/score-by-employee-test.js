import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/score-by-employee', 'Integration | Component | callbusi/mobile/score by employee', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/score-by-employee}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/score-by-employee}}
      template block text
    {{/callbusi/mobile/score-by-employee}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

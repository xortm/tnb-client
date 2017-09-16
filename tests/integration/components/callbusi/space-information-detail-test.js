import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi\space-information-detail', 'Integration | Component | callbusi\space information detail', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi\space-information-detail}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi\space-information-detail}}
      template block text
    {{/callbusi\space-information-detail}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

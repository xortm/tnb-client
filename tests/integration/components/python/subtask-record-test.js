import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('python/subtask-record', 'Integration | Component | python/subtask record', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{python/subtask-record}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#python/subtask-record}}
      template block text
    {{/python/subtask-record}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

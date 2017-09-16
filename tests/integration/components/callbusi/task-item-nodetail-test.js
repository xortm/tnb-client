import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/task-item-nodetail', 'Integration | Component | callbusi/task item nodetail', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/task-item-nodetail}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/task-item-nodetail}}
      template block text
    {{/callbusi/task-item-nodetail}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

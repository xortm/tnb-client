import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/task-item', 'Integration | Component | callbusi/task item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{callbusi/task-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#callbusi/task-item}}
      template block text
    {{/callbusi/task-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

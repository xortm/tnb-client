import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/timed-task', 'Integration | Component | callbusi/mobile/timed task', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/timed-task}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/timed-task}}
      template block text
    {{/callbusi/mobile/timed-task}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/any-timed-task', 'Integration | Component | callbusi/mobile/any timed task', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/any-timed-task}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/any-timed-task}}
      template block text
    {{/callbusi/mobile/any-timed-task}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

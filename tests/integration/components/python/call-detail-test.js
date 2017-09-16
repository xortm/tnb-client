import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('python/call-detail', 'Integration | Component | python/call detail', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{python/call-detail}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#python/call-detail}}
      template block text
    {{/python/call-detail}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

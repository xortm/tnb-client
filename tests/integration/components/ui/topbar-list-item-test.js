import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui/topbar-list-item', 'Integration | Component | ui/topbar list item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{ui/topbar-list-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#ui/topbar-list-item}}
      template block text
    {{/ui/topbar-list-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui/popmenu-item', 'Integration | Component | ui/popmenu item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui/popmenu-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui/popmenu-item}}
      template block text
    {{/ui/popmenu-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

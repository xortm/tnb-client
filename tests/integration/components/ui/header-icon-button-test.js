import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui/header-icon-button', 'Integration | Component | ui/header icon button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui/header-icon-button}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui/header-icon-button}}
      template block text
    {{/ui/header-icon-button}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

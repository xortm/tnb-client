import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui/img-intergration', 'Integration | Component | ui/img intergration', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui/img-intergration}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui/img-intergration}}
      template block text
    {{/ui/img-intergration}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

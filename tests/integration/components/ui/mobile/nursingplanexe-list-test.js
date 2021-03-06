import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui/mobile/nursingplanexe-list', 'Integration | Component | ui/mobile/nursingplanexe list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui/mobile/nursingplanexe-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui/mobile/nursingplanexe-list}}
      template block text
    {{/ui/mobile/nursingplanexe-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

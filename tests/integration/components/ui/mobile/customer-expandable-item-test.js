import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui/mobile/customer-expandable-item', 'Integration | Component | ui/mobile/customer expandable item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui/mobile/customer-expandable-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui/mobile/customer-expandable-item}}
      template block text
    {{/ui/mobile/customer-expandable-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

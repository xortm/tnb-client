import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui/mobile/finish-button', 'Integration | Component | ui/mobile/finish button', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui/mobile/finish-button}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui/mobile/finish-button}}
      template block text
    {{/ui/mobile/finish-button}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

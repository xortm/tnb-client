import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui/addon/bs-datetimepicker', 'Integration | Component | ui/addon/bs datetimepicker', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui/addon/bs-datetimepicker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui/addon/bs-datetimepicker}}
      template block text
    {{/ui/addon/bs-datetimepicker}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

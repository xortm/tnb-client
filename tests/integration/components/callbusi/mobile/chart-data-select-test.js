import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/chart-data-select', 'Integration | Component | callbusi/mobile/chart data select', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/chart-data-select}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/chart-data-select}}
      template block text
    {{/callbusi/mobile/chart-data-select}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

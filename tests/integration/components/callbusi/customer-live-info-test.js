import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi\customer-live-info', 'Integration | Component | callbusi\customer live info', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi\customer-live-info}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi\customer-live-info}}
      template block text
    {{/callbusi\customer-live-info}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

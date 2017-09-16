import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/customer-detail-information', 'Integration | Component | callbusi/mobile/customer detail information', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/customer-detail-information}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/customer-detail-information}}
      template block text
    {{/callbusi/mobile/customer-detail-information}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

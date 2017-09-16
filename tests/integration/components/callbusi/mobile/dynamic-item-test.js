import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/dynamic-item', 'Integration | Component | callbusi/mobile/dynamic item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/dynamic-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/dynamic-item}}
      template block text
    {{/callbusi/mobile/dynamic-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

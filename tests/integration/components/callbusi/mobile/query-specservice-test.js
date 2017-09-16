import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/query-specservice', 'Integration | Component | callbusi/mobile/query specservice', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/query-specservice}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/query-specservice}}
      template block text
    {{/callbusi/mobile/query-specservice}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

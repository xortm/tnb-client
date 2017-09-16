import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/bed-choose', 'Integration | Component | callbusi/bed choose', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/bed-choose}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/bed-choose}}
      template block text
    {{/callbusi/bed-choose}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

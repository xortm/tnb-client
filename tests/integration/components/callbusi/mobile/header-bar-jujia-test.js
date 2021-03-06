import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/header-bar-jujia', 'Integration | Component | callbusi/mobile/header bar jujia', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/header-bar-jujia}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/header-bar-jujia}}
      template block text
    {{/callbusi/mobile/header-bar-jujia}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

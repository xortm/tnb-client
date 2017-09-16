import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foot-bar-jujia', 'Integration | Component | foot bar jujia', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{foot-bar-jujia}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#foot-bar-jujia}}
      template block text
    {{/foot-bar-jujia}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

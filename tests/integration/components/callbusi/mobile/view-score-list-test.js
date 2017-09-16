import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/view-score-list', 'Integration | Component | callbusi/mobile/view score list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/view-score-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/view-score-list}}
      template block text
    {{/callbusi/mobile/view-score-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

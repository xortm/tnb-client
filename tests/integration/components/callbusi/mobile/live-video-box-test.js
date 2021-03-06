import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('callbusi/mobile/live-video-box', 'Integration | Component | callbusi/mobile/live video box', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{callbusi/mobile/live-video-box}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#callbusi/mobile/live-video-box}}
      template block text
    {{/callbusi/mobile/live-video-box}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui/img-zoomage', 'Integration | Component | ui/img zoomage', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui/img-zoomage}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui/img-zoomage}}
      template block text
    {{/ui/img-zoomage}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

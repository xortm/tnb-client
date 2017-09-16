import { moduleForModel, test } from 'ember-qunit';

moduleForModel('localstorage/invitation', 'Unit | Serializer | localstorage/invitation', {
  // Specify the other units that are required for this test.
  needs: ['serializer:localstorage/invitation']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});

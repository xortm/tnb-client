import { moduleForModel, test } from 'ember-qunit';

moduleForModel('localstorage/user-task', 'Unit | Serializer | localstorage/user task', {
  // Specify the other units that are required for this test.
  needs: ['serializer:localstorage/user-task']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});

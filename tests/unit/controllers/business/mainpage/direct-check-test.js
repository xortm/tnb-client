import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('controller:business/mainpage/direct-check', 'Unit | Controller | business/mainpage/direct check', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('order bed computed', function(assert) {
  let controller = this.subject();
  let orderBed = Ember.Object.create({
    id: "123",
    name: "test bed"
  });
  let allBed1 = Ember.Object.create({
    id: "1",
    name: "abed1"
  });
  let customerbusinessflowInfo = Ember.Object.create({
    orderBed:orderBed
  });
  let allBedList = new Ember.A();
  allBedList.pushObject(allBed1);
  controller.set("dataLoader",Ember.Object.create({
    allBedList:allBedList
  }));
  controller.set("customerbusinessflowInfo",customerbusinessflowInfo);
  let bedList = controller.get("bedList");
  let bed = bedList.findBy("name","test bed");
  // assert(bed);
  assert.equal(bed.get("id"),"123");
});

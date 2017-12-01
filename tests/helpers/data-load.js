import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('dataLoad', function(app) {
  return new Ember.Test.promise(function(resolve) {
    console.log("data load test helper in");
    Ember.Test.adapter.asyncStart();
    let dataLoader = app.__container__.lookup('service:data-loader');
    console.log("dataLoader get",dataLoader);
    let promise = dataLoader.dataLoadPro();
    promise.then(function(){
      console.log("dataLoadPro promise then");
      Ember.run.schedule('afterRender', null, resolve);
      Ember.Test.adapter.asyncEnd();
    });
  });
});

import Ember from "ember";

export default function() {
  if (Ember.testing) {
    this.setDefault({duration: 10});
  }
  console.log("def transition");
  //所有loading都使用动画
  this.transition(
    this.toRoute('business.mainpage.loading'),
    this.use('toLeft')
  );
  // this.transition(
  //   this.fromRoute('business.mainpage.task-square'),
  //   this.toRoute('business.mainpage.task-detail',[function(routeName){
  //     console.log("to route check:" + routeName);
  //     var match = /^business.mainpage.task-detail/.test(routeName);
  //     console.log("match is:" + match);
  //     return match;
  //   }]),
  //   this.use('toLeft'),
  //   this.debug()
  // );
  // this.transition(
  //   this.fromRoute('business.mainpage.lineuse'),
  //   this.toRoute('business.mainpage.call-record'),
  //   this.use('toLeft'),
  //   this.reverse('toRight'),
  //   this.debug()
  // );
}

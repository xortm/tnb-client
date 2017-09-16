import Ember from 'ember';

export default Ember.Service.extend({
  isInViewport(elName) {
    var selector = "div[name='" + elName + "']";
    console.log("selector in v:" + selector);
    var element = $(selector).get(0);
    console.log("element in",element);
    if(!element){
      return false;
    }
    var rect = element.getBoundingClientRect();
    var html = document.documentElement;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || html.clientHeight) &&
      rect.right <= (window.innerWidth || html.clientWidth)
    );
  }
});

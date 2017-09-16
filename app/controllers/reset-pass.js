import Ember from 'ember';
import Reset from './user-reg';
import InfiniteScroll from './infinite-scroll';

export default Reset.extend(InfiniteScroll,{
  infiniteContentPropertyName: "resetPass",
  infiniteModelName: "user",
  infiniteContainerName:"resetPassContainer",

  actions:{
    // 发送验证码
    sendMCode() {
      this.sendMCodeEvent('reset');
    },
    sendSCode() {
      this.sendSCodeEvent('reset');
    },
    // 提交
    resetEvent: function() {
      this.submitInfoEvent('reset');
    },
  }
});

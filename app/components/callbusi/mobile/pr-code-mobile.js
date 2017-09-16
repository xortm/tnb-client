import Ember from 'ember';
import GesturesBsModal from 'ember-bootstrap/components/bs-modal';

export default GesturesBsModal.extend({
  didInsertElement(){
    this._super(...arguments);
    console.log("didInsertElement in prcode modal:");
    // this.set('showPopQrModal',false);
    var curUser=this.get('user');
    var url="http://web.callcloud.com.cn/#/user-reg?loginType=2&inviter="+curUser.get("id");
    console.log('myinfo qr code url============',url);
    jQuery('#popModal_qrco').qrcode(url);
  }
});

import Ember from 'ember';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import '../helpers/data-load';
import { test } from 'qunit';
import moduleForAcceptance from 'tiannianbao/tests/helpers/module-for-acceptance';
/*
 * 直接入住验收测试类
 * 创建人：梁慕学
 * 创建日期：2017-10-18
 */

let application;
moduleForAcceptance('Acceptance | BusinessTest:direct check',{
  beforeEach(){
    console.log("start app");
    application = startApp();
  },
  afterEach(){
    destroyApp(application);
  }
});

test('visiting direct-check', function(assert) {
    // assert.expect(1);
    // dataLoad();
    visit('/business/mainpage/direct-check');
    andThen(function(){
      console.log("and then in");
      var jdom = find('form span:contains("结算类型")').parent();
      var jvalue = jdom.find("div").html();
      console.log("jdom get",jdom.get(0));
      assert.equal( jvalue, "月结", "入住方式，只能月结" );
    });
});

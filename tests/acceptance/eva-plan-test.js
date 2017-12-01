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
moduleForAcceptance('Acceptance |BusinessTest: eva plan',{
  beforeEach(){
    console.log("start app");
    application = startApp();
  },
  afterEach(){
    destroyApp(application);
  }
});
//计划模板新增以及保存
test('visiting eva-plan and save', function(assert) {
    // assert.expect(5);
    // dataLoad();
    visit('/business/mainpage/eva-plan');
    andThen(function(){
      console.log("and then in");
      var jdom = find('button span:contains("新增评估模板")');
      //验证是否有新增按钮
      assert.equal( jdom.size(), 1, "新增评估模板按钮" );
      click('button span:contains("新增评估模板")');
      andThen(function(){
        var idom = find('div.form-input-group span:contains("规范类型")');
        //验证是否有模板规范选择
        assert.equal( idom.size(), 1, "模板规范类型选择框" );
        var bdom = find('span:contains("北京市入住评估规范")');
        //验证选择框是否包含北京市入住评估规范
        assert.equal( bdom.size(), 1, "选择框包含北京市入住评估规范" );
        var adom = find('div.form-input-group span:contains("评估类型")');
        //验证是否有评估类型选择
        assert.equal( adom.size(), 1, "评估类型选择框" );
        var cdom = find('span:contains("日常生活活动评估")');
        //验证选择框是否包含日常生活活动评估
        assert.equal( cdom.size(), 1, "选择框包含日常生活活动评估" );
        fillIn('input[name="titleInput"]', '日常评估业务测试');
        click('form.confirmCreate button:first');
        andThen(function(){
          var tdom = find('div[name="eva-plan-detail"]');
          //验证点击确定过后，是否能进入新增页面
          assert.equal( tdom.size(), 1, "进入了新增页面" );
          fillIn('textarea', '日常评估业务测试说明');
          //填写问题
          click("div[name='add-question']");
          andThen(function(){
            fillIn("#ember-bootstrap-modal-container textarea","问题一");
            fillIn("div[name='answer-content']:first input","答案1-1");
            fillIn("div[name='answer-score']:first input","0");
            fillIn("div[name='answer-content']:nth(1) input","答案1-2");
            fillIn("div[name='answer-score']:nth(1) input","1");
            click("#ember-bootstrap-modal-container button:first");
            andThen(function(){
              var alist = find("div[name='question-list'] span:contains('答案1-1')");
              //验证是否新增的答案显示在页面中
              assert.equal( alist.size(),1, "新增的答案显示在页面中" );
              //填写分数范围
              click('div[name="add-score"]');
              andThen(function(){
                var levelDom = find('div.form-input-group span:contains("老人能力等级")');
                //验证是否有老人能力等级选择框
                assert.equal( levelDom.size(), 1, "能力等级选择框");
                fillIn('input[type="minScore"]', 0);
                fillIn('input[type="maxScore"]', 1);
              });
            });
          });

        });
      });
    });
});

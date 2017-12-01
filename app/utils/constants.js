export default {
  /*字典部分*/
  week:'week',//周标识
  activityType:'activityType',//活动类别
  planExeStatus:'planExeStatus',//执行状态
  vipLevel:'vipLevel',//会员等级
  leaveReason:"leaveReason",//退住原因
  accessType:'accessType',//跟进类别
  customerStatus:"customerStatus",//入住状态
  medicalInsuranceType:"medicalInsuranceType",//医保类别
  oldManType:"oldManType",//老人类型
  birtydayType:"birtydayType",//生日习惯
  applyStatus1:"applyStatus1",//未变更
  applyStatus:"applyStatus",//变更状态
  accountType2:"accountType2",//电子现金账户
  accountType1:"accountType1",//保证金账户
  bedStatusIdle:"bedStatusIdle",//空闲床位
  rechargeChannel:"rechargeChannel",//充值方式
  accountType:"accountType",//账户类型
  backVistType:"backVistType",//回访类型
  consultSource:"consultSource",//了解渠道
  consultSource6:"consultSource6",//网络媒体
  consultChannel:"consultChannel",//咨询方式
  consultChannelTel:"consultChannelTel",//电话

  consultStatus4:"consultStatus4",//已试住
  consultStatus5:"consultStatus5",//已入住
  consultStatus6:"consultStatus6",//退住
  consultStatus7:"consultStatus7",//退住作废
  leaveStatus1:"leaveStatus1",//申请退住
  leaveStatus2:"leaveStatus2",//费用结算中
  leaveStatus3:"leaveStatus3",//完成退住
  leaveStatus4:"leaveStatus4",//审核通过
  leaveStatus5:"leaveStatus5",//作废
  leaveStatus6:"leaveStatus6",//费用结算完成
  tenantStatus:"tenantStatus",
  exeStatus1:"exeStatus1",//完成-客户配合
  exeStatus2:"exeStatus2",//完成-客户不配合
  exeStatus3:"exeStatus3",//未完成
  publicType:"publicType",//公共区域类型
  orgType:"orgType",
  postType:"postType",//岗位
  nativePlace:"nativePlace",//老人籍贯
  nationality:"nationality",//老人民族
  educationLevelPrimary:"educationLevelPrimary",//小学及以下
  educationLevelJunior:"educationLevelJunior",//初中
  educationLevelSenior:"educationLevelSenior",//高中
  educationLevelUniversity:"educationLevelUniversity",//大学及以上
  healthExamType:"healthExamType",
  healthExamType1:"healthExamType1",//血压
  healthExamType2:"healthExamType2",//血氧
  healthExamType3:"healthExamType3",//脉搏 心率
  healthExamType6:"healthExamType6",//体重
  healthExamType9:"healthExamType9",//餐后血糖
  healthExamType8:"healthExamType8",//餐前血糖
  healthExamType7:"healthExamType7",//空腹血糖
  hbeaconWarning:"hbeaconWarning",
  staffschedule:"staffschedule",
  customerStatusIn:"customerStatusIn",  //入住 状态
  customerStatusTry:"customerStatusTry", //试住状态
  // worktimesetting:"worktimesetting",
  nursingLevel:"nursingLevel",
  diningStandard:"diningStandard",//餐饮标准
  relationType:"relationType",//咨询人与老人关系
  maritalStatus:"maritalStatus",//婚姻状况
  educationLevel:"educationLevel",//教育级别
  religion:"religion",
  bloodType:"bloodType",
  selfCareLevel:"selfCareLevel",//自理等级
  conRelationType:"conRelationType",//咨询形式
  sexType: "sexType",//性别
  sportType: "sportType",//运动类型
  feedbackType: "feedbackType",//反馈类型
  feedBackTypeOrg: "feedBackTypeOrg",//机构端反馈类型
  staffStatus:"staffStatus",//员工状态
  staffStatusLeave:"staffStatusLeave",//离职
  staffStatusIn:"staffStatusIn",//在职
  nurseTag:"nurseTag",//护理日志执行情况状态
  employeeStatus:"employeeStatus",//系统用户状态
  employeeStatus1:'employeeStatus1',//用户可用
  employeeStatus2:'employeeStatus2',//用户禁用
  position:"position",//职位
  hireType:"hireType",//雇佣类型
  uploadFileType_image:"image",//上传图片文件
  uploadFileType_zipPackage:"zipPackage",//上传压缩包文件
  uploadBusinessType_idcard:"idcardImg",//上传业务类型：身份证图片
  uploadBusinessType_jujia:"reportImg",//上传业务类型：居家类型图片
  uploadBusinessType_headimg:"headImg",//上传业务类型：头像图片
  uploadBusinessType_iconFile:"iconFile",//上传业务类型：任务图片
  uploadBusinessType_phoneNumAuth:"phoneNumAuth",//上传业务类型：外显号码
  uploadBusinessType_qualificationImg:'qualificationImg',//上传资质文件
  accountType_weixin: 1,//账户类型微信
  accountType_zhifubao: 2,//账户类型支付宝
  accountType_card: 3,//账户类型银行卡
  payType_recharge:1,//充值
  payType_apply:2,//提现
  payStatus_processing:0,//正在处理
  payStatus_complete:1,//成功
  payStatus_fail:2,//失败
  payStatus_not:3,//未支付
  authenticate_forbidden:0,//已禁用
  authenticate_not:1,//未认证
  authenticate_yes:2,//已申请认证
  authenticate_succ:3,//认证成功
  authenticate_fail:4,//认证失败
  callStatus_callWait: "callWait",//等待接听
  callStatus_callFailure: "callFailure",//通话失败
  callStatus_calling: "callDialing",//拨号中
  callStatus_inCall: "callInBusy",//通话中
  callStatus_callEnd: "callEnd",//通话结束
  callStatus_callLost: "callLost",//未接通
  callType_callOprDial: "callOprDial",//拨打
  taskStatus_begin:"taskHasBegun",//任务已开始
  taskStatus_saved:"taskSaved",//任务已保存草稿
  taskStatus_submitted:"taskSubmitted",//任务已提交审核
  taskStatus_isPassed:"taskIsPassed",//任务审核通过未开始
  taskStatus_isEnd:"taskIsEnd",//任务已结束
  taskStatus_noPass:"taskNoPass",//任务审核不通过
  taskApplyStatus_apply: "taskApply",//已申请
  taskApplyStatus_applySuc: "taskApplySucc",//已通过
  taskApplyStatus_hasSign: "hasSign",//已签到
  //taskApplyStatus_applyFail: "taskApplyFail",//已拒绝
  taskApplyStatus_applyFail: "taskApplyFail",//企业审核未通过
  taskApplyStatus_refuseInvitation:"taskApplyRefuseInvitation",//已拒绝邀请
  //taskApplyStatus_refuseInvitation:"taskApplyRefuseInvitation",//已拒绝邀请
  taskApplyStatus_invited:"taskApplyInvited",//已邀请
  taskApplyStatus_SuccNotLocateSeat:"taskApplySuccNotLocateSeat",//已通过（未分配坐席）
  taskInviteStatus_invite: "taskInvited",//已邀请
  taskInviteStatus_inviteFail: "taskInviteFail",//邀请失败
  proportion_platform:"proportionOfPlatform",//提佣比例
  customer_callBill:"customerCallBill",//客服拨打话费/分钟
  withdrawCash_Succ:"withdrawCashSucc",//提现成功 (事件通知的business字段 业务类型)
  withdrawCash_Fail:"withdrawCashFail",//提现失败
  recharge_Succ:"rechargeSucc",//充值成功
  recharge_Fail:"rechargeFail",//充值失败
  bindWechat_Succ:"bindWechatSucc",//绑定微信成功
  bindWechat_Fail:"bindWechatFail",//绑定微信失败
  bizTypeCsOnline_Pay:"bizTypeCsOnlinePay",//客服在线时长报酬
  bizTypeCsCallOut_Pay:"bizTypeCsCallOutPay",//客服外呼报酬
  bizTypeCsCallIn_Pay:"bizTypeCsCallInPay",//客服外呼报酬
  bizTypeCsMake_ADeal:"bizTypeCsMakeADeal",//客服成单
  bizTypeCsInviteCode_Commission:"bizTypeCsInviteCodeCommission",//客服邀请码提拥
  bizTypeCsForwCircle_FriendsPay:"bizTypeCsForwCircleFriendsPay",//客服转发朋友圈报酬（比如话费赠送）
  bizTypeCircleFriendsRegisterPay:"bizTypeCircleFriendsRegisterPay",//从朋友圈注册客服赠送（比如随机话费）
  bedType:"bedType",//床位类型
  roomDirection:"roomDirection",//房屋朝向
  roomType:"roomType",//房间类型
  careType:"careType",//护理类别
  evaluateType:"evaluateType",//问卷类型
  period:"period",//周期
  countType:"countType",//类别
  projectType:"projectType",//方案类型
  withdraw_Cash:"withdrawCash",//提现
  /*请求action部分*/
  action_sign: "sign",//签入(签出)
  consultStatus:"consultStatus",//预定状态
  orderType:"orderType",//预定方式
  sexTypeMale:"sexTypeMale",//男
  sexTypeFemale:"sexTypeFemale",//女
  consultStatus3:"consultStatus3",//已预定
  consultStatus1:"consultStatus1",//新创建
  billType:"billType",//账单类型
  billType1:"billType1",//周统计
  billType2:"billType2",//月统计
  billType3:"billType3",//季统计
  billType4:"billType4",//年统计
  billStatus:"billStatus",//账单状态
  billStatus0:"billStatus0",//未提交
  billStatus1:"billStatus1",//已提交
  billStatus2:"billStatus2",//审核通过
  billStatus3:"billStatus3",//审核未通过
  dayBillStatus:"dayBillStatus",//日账单状态
  billStatType:"billStatType",//账单统计类型
  createType1:"createType1",//系统生成
  createType2:"createType2",//手动生成
  consumeType:"consumeType",//消费类型
  roleType:"roleType",//角色类型
  serviceType:"serviceType",//项目类型
  drugType:"drugType",//药品类型
  drugSpec:"drugSpec",//药品最小规格
  drugForm:"drugForm",//药品剂型
  useDrugResult:"useDrugResult",//用药完成情况
  useDrugResult1:"useDrugResult1",//用药 完成
  deviceStatus:"deviceStatus",//设备状态
  deviceStatus1:'deviceStatus1',//空闲
  deviceStatus2:'deviceStatus2',//已占用
  deviceStatus3:'deviceStatus3',//无法使用
  inPreference:'inPreference',//入住偏好
  liveIntent:'liveIntent',//入住意向
  liveIntent1:"liveIntent1",//初步了解
  statType11:'statType11',//咨询量统计
  statType12:'statType12',//营销渠道统计
  statType13:'statType13',//入住偏好统计
  deviceType:"deviceType",//硬件类别
  deviceType4:"deviceType4",//手环硬件
  advWay:"advWay",//营销渠道
  schemeType1:"schemeType1",//膳食方案類型
  schemeType2:"schemeType2",//運動方案類型
  schemeType5:"schemeType5",//中醫方案類型
  colorType:"colorType",//班次颜色
  messageBusinessType:"messageBusinessType",//消息类型
  bindStatus:"bindStatus",//绑定状态
  nurseMerchType:"nurseMerchType",//医护物品
  nurseMerchUnit:"nurseMerchUnit",//医护物品单位
  serviceValueType:"serviceValueType",//服务类型，增值服务或基础服务
  customerPreference:"customerPreference",//老人偏好
  orderStatus:"orderStatus",//预定状态
  setDrugDaysRemind:"drugDay", //设置缺药提醒天数
  employeeLeaveType:"employeeLeaveType",//员工请假类型
  hbeaconWarningCancelByHand:"hbeaconWarningCancelByHand",//已处理的typecode
  hbeaconWarningCancelBySys:"hbeaconWarningCancelBySys",//已复位的typecode
  hbeaconWarningCalling:"hbeaconWarningCalling",//未处理的typecode
  servicefinishlevelDefault1:"default1",//默认标签选择id号
  servicefinishlevelDefault2:"default2",//默认标签选择id号,暂时未用
  servicefinishlevelDefault3:"default3",//默认标签选择id号
  leave:"leave",//员工请假在remark中的标识
  assessmentType:'assessmentType',//员工考核类型
  assessmentType1:'assessmentType1',//员工考核类型-抽查考核
  assessmentType2:'assessmentType2',//员工考核类型-日常考核
  fieldType:'fieldType',//数据类型
  fieldType1:'fieldType1',//数字
  fieldType2:'fieldType2',//字符串
  fieldType3:'fieldType3',//枚举
  fieldType4:'fieldType4',//布尔
  appraiseType1:'appraiseType1',//机构评价
  appraiseType2:'appraiseType2',//员工评价
  dynamicType1:'dynamicType1',//视频
  dynamicType2:'dynamicType2',//语音
  dynamicType3:'dynamicType3',//图片
  dynamicType4:'dynamicType4',//文字
  serviceItem:'serviceItem',//检查项
  actionLevel:"actionLevel",//老人能力等级
  jujiaServiceStatus:"jujiaServiceStatus",//居家订单服务状态
  jujiaServiceStatus1:"jujiaServiceStatus1",//居家订单服务状态-待分配
  jujiaServiceStatus2:"jujiaServiceStatus2",//居家订单服务状态-已分配
  payType:"payType",//居家订单支付方式
  serviceSource:"serviceSource",//项目分类，居家或机构
  foodTimeType:"foodTimeType",//菜品时间  早中晚
  foodType:"foodType",//食物类型
  goodsType:'goodsType',//物品类型
  purchaseType:'purchaseType',//采购类型
  /*界面部分*/
  uickey_careChoice:"UIC_careChoice",//界面选择记忆，护理选项
  uickey_tenantId:"UIC_tenantId",//界面选择记忆，租户id
  uickey_homePage:"UIC_homePage",//界面选择记忆，直接进入公众号的某个菜单
  addDrugType:"addDrugType",//老人用药添加类型
  chargeType:"chargeType",
  /*全局方法，用于特殊事件处理*/
  //老人生日进入选择框
  LOF_inputDateFocus: function(dom){
    console.log("inputChangeDate in,dom:",dom);
    // dom.setAttribute("type","date");
    //过滤重复事件
    var inProcess = dom.getAttribute("inProcess");
    if(inProcess&&inProcess=="yes"){
      return;
    }
    dom.setAttribute("inProcess","yes");
    //设置默认值
    var hasInit = dom.getAttribute("hasInit");
    if(!hasInit||hasInit!="yes"){
      var nowYear = new Date().getFullYear();
      var beginDate = nowYear-80+"-06-15";
      // dom.value = beginDate;
      dom.setAttribute("placeholder","");
      dom.setAttribute("hasInit","yes");
    }
  },
  //老人生日选择日期
  LOF_inputDateChange: function(dom){
    console.log("LOF_inputDateChange in,dom:",dom);
    //取消过滤标志
    dom.setAttribute("inProcess","no");
  }
};

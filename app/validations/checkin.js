import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  bedPrice:[
    validatePresence({ presence: true, message: '床位实际价格不能为空'}),
    validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '床位价格必须为非零开头的整数' })
  ],
  levelPrice:[
    validatePresence({ presence: true, message: '护理实际价格不能为空'}),
    validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '护理价格必须为非零开头的整数' })
  ],
  diningStandardPrice:[
    validatePresence({ presence: true, message: '餐饮实际价格不能为空'}),
    validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '餐饮价格必须为非零开头的整数' })
  ],
  nursinglevel:[
    validatePresence({ presence: true, message: '护理等级不能为空'})
  ],
  diningStandard:[
    validatePresence({ presence: true, message: '餐饮等级不能为空'})
  ],
  checkInStaff:[
    validatePresence({ presence: true, message: '经办人不能为空' })
  ],
  checkInBed:[
    validatePresence({ presence: true, message: '入住床位不能为空'})
  ],
  inPreference:[
    validatePresence({ presence: true, message: '入住偏好不能为空' })
  ],
  checkInEndTime:[
    validatePresence({ presence: true, message: '入住结束日期不能为空' })
  ],
  checkInStartTime:[
    validatePresence({ presence: true, message: '入住开始日期不能为空' })
  ],
  checkInDate:[
    validatePresence({ presence: true, message: '入住办理日期不能为空' })
  ],
  inContractNO:[
    validatePresence({ presence: true, message: '入住合同编号不能为空' })
  ],
  orderMoney:[
    validatePresence({ presence: true, message: '保证金不能为空' }),
    validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '保证金必须为非零开头的整数' })
  ],
  customerStatus:[
    validatePresence({ presence: true, message: '入住类型不能为空' })
  ],
  advWay:[
    validatePresence({ presence: true, message: '营销渠道不能为空' })
  ],
  customerName:[
    validatePresence({ presence: true, message: '老人姓名不能为空' })
  ],
  customerTel:[
    validatePresence({ presence: true, message: '老人电话不能为空' }),
    validateFormat({ regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '请输入正确的电话号码' })
  ],
  customerCardCode:[
    validatePresence({ presence: true, message: '身份证号不能为空' }),
    validateFormat({ regex:  /^((\d{6})(18\d{2}|19\d{2}|20[0|1]\d)(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])(\d{3})$|^(\d{6})(18\d{2}|19\d{2}|20[0|1]\d)(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])(\d{3})(\d|X|x))$/, message: '请输入正确身份证号码' })
  ],
  customerSelfCareAbility:[
    validatePresence({ presence: true, message: '自理能力不能为空' })
  ],
  guardianFirstName:[
    validatePresence({ presence: true, message: '联系人姓名不能为空' })
  ],
  // guardianFirstCardCode:[
  //   validatePresence({ presence: true, message: '联系人身份证号不能为空' }),
  //   validateFormat({ regex: /^((\d{6})(18\d{2}|19\d{2}|20[0|1]\d)(0[1-9]|1[0-2])([0-2][0-9])(\d{3})$|^(\d{6})(18\d{2}|19\d{2}|20[0|1]\d)(0[1-9]|1[0-2])([0-2][0-9])(\d{3})(\d|X|x))$/, message: '请输入正确身份证号码' })
  // ],
  guardianFirstContact:[
    validatePresence({ presence: true, message: '联系人电话不能为空' }),
    validateFormat({ regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '请输入正确的电话号码' })
  ],
};

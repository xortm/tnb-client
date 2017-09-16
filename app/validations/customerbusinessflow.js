import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {


  advName: [
    validatePresence({ presence: true, message: '预定人姓名不能为空' })
  ],
  advTel:[
    validatePresence({ presence: true, message: '预定人电话不能为空' }),
    validateFormat({ regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '请输入正确的电话号码' })
  ],
  orderBed:[
    validatePresence({ presence: true, message: '预定床位不能为空' })
  ],
  orderStaff:[
    validatePresence({ presence: true, message: '经办人不能为空' })
  ],
  orderInTime:[
    validatePresence({ presence: true, message: '入院日期不能为空' })
  ],
  orderDate:[
    validatePresence({ presence: true, message: '预定办理日期不能为空' })
  ],
  orderMoney:[
    validatePresence({ presence: true, message: '保证金不能为空' }),
    // validateNumber({ integer: true, message: '保证金必须为整数'  }),
      validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '保证金必须为非零开头的整数' })
  ],
  cusSex:[
    validatePresence({ presence: true, message: '性别不能为空' })
  ],
  cusEdu:[
    validatePresence({ presence: true, message: '文化程度不能为空' })
  ],
  cusName:[
    validatePresence({ presence: true, message: '老人姓名不能为空' })
  ],
  cusCare:[
    validatePresence({ presence: true, message: '自理等级不能为空' })
  ],
  cusNative:[
    validatePresence({ presence: true, message: '老人籍贯不能为空' })
  ],
  cusCardCode:[
    validatePresence({ presence: true, message: '身份证号不能为空' }),
    //validateFormat({ regex: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/, message: '请输入正确身份证号码' })
    validateFormat({ regex:  /^((\d{6})(18\d{2}|19\d{2}|20[0|1]\d)(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])(\d{3})$|^(\d{6})(18\d{2}|19\d{2}|20[0|1]\d)(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])(\d{3})(\d|X|x))$/, message: '请输入正确身份证号码' })
  ],
};

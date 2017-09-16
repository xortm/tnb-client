import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  address:[
    validatePresence({ presence: true, message: '地址不能为空' })
  ],
  /*orgTel:[
    validatePresence({ presence: true, message: '机构电话不能为空' }),
    validateFormat({ regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '请输入正确的电话号码' })
  ],*/
  linkMan:[
    validatePresence({ presence: true, message: '联系人姓名不能为空' })
  ],
  linkManTel:[
    validatePresence({ presence: true, message: '联系人电话不能为空' }),
  //  validateFormat({ regex: /(^1(3|4|5|7|8)\d{9}$)/, message: '请输入正确的手机号码' })
    validateFormat({ regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '请输入正确的电话号码' })
  ],
  // remark:[
  //   validateLength({ min: 0, max: 1000 ,message: '最大不能超过1000个字符'})
  // ]
};

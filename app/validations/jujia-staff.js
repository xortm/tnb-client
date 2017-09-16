import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '姓名不能为空' }),
    validateLength({ min: 2 , message: '姓名不能少于2个字' })
  ],
  staffSex:[
    validatePresence({ presence: true, message: '性别不能为空' })
  ],
  curAddress:[
    validatePresence({ presence: true, message: '当前住址不能为空' })
  ],
  staffTel:[
    validatePresence({ presence: true, message: '电话不能为空' }),
    validateFormat({ regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '请输入正确的电话号码' })
  ],
  staffCardCode:[
    validatePresence({ presence: true, message: '身份证号码不能为空' }),
    validateFormat({ regex: /^((\d{6})(18\d{2}|19\d{2}|20[0|1]\d)(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])(\d{3})$|^(\d{6})(18\d{2}|19\d{2}|20[0|1]\d)(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])(\d{3})(\d|X|x))$/, message: '请输入正确身份证号码' })
  ],
  staffCensus:[
    validatePresence({ presence: true, message: '籍贯不能为空' })
  ],
  staffNation:[
    validatePresence({ presence: true, message: '民族不能为空' })
  ],
  // loginName:[
  //   validateFormat({ regex: /(^1(3|4|5|7|8)\d{9}$)/, message: '请输入正确的手机号码' })
  // ],
  // toPositionDate:[
  //   validatePresence({ presence: true, message: '入职时间不能为空' })
  // ],
  // contractEndDate:[
  //   validatePresence({ presence: true, message: '合同截止日期' })
  // ],
  // position:[
  //   validatePresence({ presence: true, message: '岗位不能为空' })
  // ],
  // department:[
  //   validatePresence({ presence: true, message: '部门不能为空' })
  // ],
};

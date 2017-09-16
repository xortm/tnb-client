import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
     guardianFirstName: [
       validatePresence({ presence: true, message: '监护人姓名不能为空' }),
       validateLength({ min: 2 , message: '监护人姓名不能少于2个字' })
     ],
     guardianFirstContact:[
       validatePresence({ presence: true, message: '联系方式不能为空' }),
       validateFormat({ regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '请输入正确的电话号码' })
     ],
     guardianFirstCardCode:[
       validatePresence({ presence: true, message: '身份证号码不能为空' }),
        validateFormat({ regex: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/, message: '请输入正确身份证号码' })
     ],
     guardianFirstGener:[
       validatePresence({ presence: true, message: '联系人性别不能为空' })
     ],
     firstRelation:[
       validatePresence({ presence: true, message: '与老人关系不能为空' })
     ],

};

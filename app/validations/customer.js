import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '老人姓名不能为空' }),
    validateLength({ min: 2 , message: '老人姓名不能少于2个字' })
  ],
  sex:[
    validatePresence({ presence: true, message: '性别不能为空' })
  ],
  // birthday:[
  //    validatePresence({ presence: true, message: '出生日期不能为空' })
  //  ],
   phone:[
      validatePresence({ presence: true, message: '电话不能为空' }),
      validateFormat({ regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '请输入正确的电话号码' })
    ],
    // nationality:[
    //    validatePresence({ presence: true, message: '名族不能为空' })
    //  ],
     cardCode:[
       validatePresence({ presence: true, message: '身份证号码不能为空' }),
        //validateFormat({ regex: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/, message: '请输入正确身份证号码' })
        validateFormat({ regex: /^((\d{6})(18\d{2}|19\d{2}|20[0|1]\d)(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])(\d{3})$|^(\d{6})(18\d{2}|19\d{2}|20[0|1]\d)(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])(\d{3})(\d|X|x))$/, message: '请输入正确身份证号码' })
     ],
    //  customerNative:[
    //    validatePresence({ presence: true, message: '籍贯不能为空' })
    //  ],
    //  address:[
    //    validatePresence({ presence: true, message: '家庭住址不能为空' })
    //  ],
    //  customerPS:[
    //    validatePresence({ presence: true, message: '身体情况不能为空' })
    //  ],
    //  customerCustom:[
    //    validatePresence({ presence: true, message: '生活习惯不能为空' })
    //  ],
    //  customerCharacter:[
    //    validatePresence({ presence: true, message: '性格特点不能为空' })
    //  ],
    //  customerHobby:[
    //    validatePresence({ presence: true, message: '个人爱好不能为空' })
    //  ],
    //  customerDiet:[
    //    validatePresence({ presence: true, message: '饮食偏好不能为空' })
    //  ],
    //  guardianFirstName: [
    //    validatePresence({ presence: true, message: '联系人姓名不能为空' }),
    //    validateLength({ min: 2 , message: '联系人姓名不能少于2个字' })
    //  ],
    //  guardianFirstContact:[
    //    validatePresence({ presence: true, message: '电话不能为空' }),
    //    validateFormat({ regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '请输入正确的电话号码' })
    //  ],
    //  guardianFirstCardCode:[
    //    validatePresence({ presence: true, message: '身份证号码不能为空' }),
    //     validateFormat({ regex: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/, message: '请输入正确身份证号码' })
    //  ],
    //  guardianFirstWork:[
    //    validatePresence({ presence: true, message: '工作单位不能为空' })
    //  ],
    //  guardianFirstAddress:[
    //    validatePresence({ presence: true, message: '常住地址不能为空' })
    //  ],
    //  contractNO:[
    //    validatePresence({ presence: true, message: '合同编号不能为空' })
    //  ],
    //  checkInDate:[
    //    validatePresence({ presence: true, message: '入住开始日期不能为空' })
    //  ],
    //  checkOutDate:[
    //    validatePresence({ presence: true, message: '入住截止日期不能为空' })
    //  ],
    //  actualDeposit:[
    //    validatePresence({ presence: true, message: '保证金不能为空' })
    //  ],
    //  referencePrice:[
    //    validatePresence({ presence: true, message: '参考价格不能为空' })
    //  ],
    //  actualPrice:[
    //    validatePresence({ presence: true, message: '实际价格不能为空' })
    //  ],
     selfCareAbility:[
       validatePresence({ presence: true, message: '自理能力不能为空' })
     ],
    //  bloodType:[
    //    validatePresence({ presence: true, message: '血型不能为空' })
    //  ],
    //  religion:[
    //    validatePresence({ presence: true, message: '宗教信仰不能为空' })
    //  ],
    //  educationLevel:[
    //    validatePresence({ presence: true, message: '文化程度不能为空' })
    //  ],
    //  maritalStatus:[
    //    validatePresence({ presence: true, message: '婚姻状况不能为空' })
    //  ],
    //  guardianFirstGener:[
    //    validatePresence({ presence: true, message: '联系人性别不能为空' })
    //  ],
    //  firstRelation:[
    //    validatePresence({ presence: true, message: '与老人关系不能为空' })
    //  ],
    //  diningStandard:[
    //    validatePresence({ presence: true, message: '餐饮标准不能为空' })
    //  ],
    //  nursingGrade:[
    //    validatePresence({ presence: true, message: '护理等级不能为空' })
    //  ],
    //  bed:[
    //    validatePresence({ presence: true, message: '床位信息不能为空' })
    //  ],
};

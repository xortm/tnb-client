import {
  validatePresence,
  validateLength,
  validateNumber,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
     trueDrugNum:[
       validatePresence({ presence: true, message: '实际用药剂量不能为空' }),
      //  validateFormat({ regex: /^\d$/, message: '请输入正确用药剂量(数字)' })
      validateNumber({gte: 0, message: '请输入正确用药剂量(数字)' }),
     ],
};

import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
     bindCustomer:[
       validatePresence({ presence: true, message: '老人名字不能为空' }),
     ],
     customerBri:[
       validatePresence({ presence: true, message: '实际用药剂量不能为空' }),
     ],
};

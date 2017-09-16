import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '预定人姓名不能为空' })
  ],
  // ADVTel:[
  //   validatePresence({ presence: true, message: '预定人电话不能为空' })
  // ],
  // orderBed:[
  //   validatePresence({ presence: true, message: '预定床位不能为空' })
  // ],
  // orderStaff:[
  //   validatePresence({ presence: true, message: '经办人不能为空' })
  // ],
  // orderMoney:[
  //   validatePresence({ presence: true, message: '保证金不能为空' })
  // ],
};

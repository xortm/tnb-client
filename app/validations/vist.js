import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  // customerName: [
  //   validatePresence({ presence: true, message: '客户姓名不能为空' }),
  //   validateLength({ min: 2 , message: '客户姓名不能少于2个字' })
  // ],
  // customerTel: [
  //   validatePresence({ presence: true, message: '电话不能为空' }),
  // ],
  accessType: [
    validatePresence({ presence: true, message: '跟进类别不能为空' }),
  ],
  vistUser: [
    validatePresence({ presence: true, message: '跟进人不能为空' }),
  ],
  createDateTime: [
    validatePresence({ presence: true, message: '跟进日期不能为空' }),
  ],
};

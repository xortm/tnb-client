import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  rechargeAccount: [
    validatePresence({ presence: true, message: '账户类型不能为空' })
  ],
  rechargeCustomer: [
    validatePresence({ presence: true, message: '账户名称不能为空' })
  ],
  money: [
    validatePresence({ presence: true, message: '充值金额不能为空' }),
    validateNumber({ positive: true, message: '充值金额必须为正数' })
  ],
  channel: [
    validatePresence({ presence: true, message: '充值方式不能为空' })
  ],
};

import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat,
  validateNumber
} from 'ember-changeset-validations/validators';

export default {
  customer: [
    validatePresence({ presence: true, message: '老人姓名不能为空' }),
  ],
  createTime: [
    validatePresence({ presence: true, message: '创建时间不能为空' }),
  ],
  checkScore: [
    validatePresence({ presence: true, message: '签到分数不能为空' }),
    validateNumber({lte: 5, message: '签到分数不能大于5分' }),
  ],
  mealScore: [
    validatePresence({ presence: true, message: '膳食分数不能为空' }),
    validateNumber({lte: 5, message: '膳食分数不能大于5分' }),
  ],
  sportScore: [
    validatePresence({ presence: true, message: '运动分数不能为空' }),
    validateNumber({lte: 5, message: '运动分数不能大于5分' }),
  ],
  medicationScore: [
    validatePresence({ presence: true, message: '用药分数不能为空' }),
    validateNumber({lte: 5, message: '用药分数不能大于5分' }),
  ],
  recoveryScore: [
    validatePresence({ presence: true, message: '康复分数不能为空' }),
    validateNumber({lte: 5, message: '康复分数不能大于5分' }),
  ],
};

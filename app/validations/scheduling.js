import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  // reason: [
  //   validatePresence({ presence: true, message: '预警说明不能为空' }),
  //
  // ],
  // operateNote: [
  //   validatePresence({ presence: true, message: '处理说明不能为空' }),
  //
  // ],
  user: [
    validatePresence({ presence: true, message: '用户姓名不能为空' }),
  ],
  type: [
    validatePresence({ presence: true, message: '工作类型不能为空' }),
  ],
};

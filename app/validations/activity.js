import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  title: [
    validatePresence({ presence: true, message: '活动名称不能为空' }),
  ],
  contents: [
    validatePresence({ presence: true, message: '活动内容不能为空' }),
  ],
  pic: [
    validatePresence({ presence: true, message: '活动图片不能为空' }),
  ],
  type: [
    validatePresence({ presence: true, message: '活动类型不能为空' }),
  ],
};

import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  title: [
    validatePresence({ presence: true, message: '模板标题不能为空' })
  ]
};

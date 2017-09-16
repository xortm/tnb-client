import {
  validatePresence,
  validateNumber,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  seq: [
    validatePresence({ presence: true, message: '设备编号不能为空' })
  ],
  deviceType: [
    validatePresence({ presence: true, message: '设备类型不能为空' })
  ],
};

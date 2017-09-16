import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '楼层名称不能为空' })
  ],
  seq:[
    validatePresence({ presence: true, message: '编号不能为空' })
  ],
  building:[
    validatePresence({ presence: true, message: '所属楼宇不能为空' })
  ]
};

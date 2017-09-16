import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '名称不能为空' })
  ],
  floor:[
    validatePresence({ presence: true, message: '所属楼层不能为空' })
  ],
  build:[
    validatePresence({ presence: true, message: '所属楼宇不能为空' })
  ],

  maxName:[]
};

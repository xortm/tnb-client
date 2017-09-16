import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  publicType: [
    validatePresence({ presence: true, message: '公共区域类型不能为空' })
  ],
  // building:[
  //   validatePresence({ presence: true, message: '所属楼宇不能为空' })
  // ],
  floor:[
    validatePresence({ presence: true, message: '所属楼层不能为空' })
  ],
  name:[
    validatePresence({ presence: true, message: '公共区域名称不能为空' })
  ],

};

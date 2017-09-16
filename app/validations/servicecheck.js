import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  exeStartTime:[
    validatePresence({ presence: true, message: '开始时间不能为空' })
  ],
  customer:[
    validatePresence({ presence: true, message: '用户姓名不能为空' })
  ],
  exeStaff:[
    validatePresence({ presence: true, message: '执行人不能为空' })
  ],
  service:[
    validatePresence({ presence: true, message: '项目名称不能为空' })
  ],
};

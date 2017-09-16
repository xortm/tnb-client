import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  exeStartTime:[
    validatePresence({ presence: true, message: '记录时间不能为空' })
  ],
  recorder:[
    validatePresence({ presence: true, message: '会员姓名不能为空' })
  ],
  exeStaff:[
    validatePresence({ presence: true, message: '记录人不能为空' })
  ],
  itemProject:[
    validatePresence({ presence: true, message: '项目名称不能为空' })
  ],
  exeStatus:[
    validatePresence({ presence: true, message: '消费状态不能为空' })
  ],
};

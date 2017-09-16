import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  customer: [
    validatePresence({ presence: true, message: '老人信息不能为空' })
  ],
  leaveStaff:[
    validatePresence({ presence: true, message: '退住登记人不能为空' })
  ],
  leaveDate:[
    validatePresence({ presence: true, message: '退住日期不能为空' })
  ],
  leaveRecordDate:[
    validatePresence({ presence: true, message: '退住登记日期不能为空' })
  ],
  leaveReason:[
    validatePresence({ presence: true, message: '退住原因不能为空' })
  ],
};

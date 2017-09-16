import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  addDrugNum: [
    validatePresence({ presence: true, message: '存取数量不能为空' }),
    validateNumber({ integer: true, positive: true ,message: '存取数量必须为正整数'  })
  ],
  gatherStaff:[
    validatePresence({ presence: true, message: '操作人不能为空' })
  ],
  drug:[
    validatePresence({ presence: true, message: '药品名称不能为空' })
  ],
  addFlag:[
    validatePresence({ presence: true, message: '存取类型不能为空' })
  ],
};

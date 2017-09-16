import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  drugNum: [
    validatePresence({ presence: true, message: '用药数量数量不能为空' }),
    validateNumber({ positive: true, message: '用药数量必须为正数'  })
  ],
  finishLevel:[
    validatePresence({ presence: true, message: '完成情况不能为空' })
  ],
  exeDate:[
    validatePresence({ presence: true, message: '用药时间不能为空' })
  ],
  useDrug:[
    validatePresence({ presence: true, message: '计划用药时间不能为空' })
  ],
  lastUpdateUser:[
    validatePresence({ presence: true, message: '执行人不能为空' })
  ],
};

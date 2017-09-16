import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  useDrugNum: [
    validatePresence({ presence: true, message: '用药数量数量不能为空' }),
    validateNumber({ positive: true , message: '用药数量必须为正数' })
  ],
  useDrugWay:[
    validatePresence({ presence: true, message: '用药方法不能为空' })
  ],
  drug:[
    validatePresence({ presence: true, message: '药品名称不能为空' })
  ],
  useDrugDate:[
    // validatePresence({ presence: true, message: '用药时间不能为空' })
  ],
};

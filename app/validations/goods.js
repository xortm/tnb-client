import {
  validatePresence,
  validateNumber,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '物品名称不能为空' })
  ],
  goodsType:[
    validatePresence({ presence: true, message: '物品类型不能为空' }),
  ],
  unit:[
    validatePresence({ presence: true, message: '单位不能为空' }),
  ],
};

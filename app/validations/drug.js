import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '商品名称不能为空' }),
  ],
  drugForm:[
      validatePresence({ presence: true, message: '制剂不能为空' }),
  ],
  drugSpec:[
      validatePresence({ presence: true, message: '剂型不能为空' }),
  ],
  printTypeValue:[
      validatePresence({ presence: true, message: '分药类型不能为空' }),
  ],
  // unit:[
  //     validatePresence({ presence: true, message: '剂量单位不能为空' }),
  // ],
  // spec:[
  //     validatePresence({ presence: true, message: '最小规格不能为空' }),
  // ],
};

import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat,
  validateNumber
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '项目名称不能为空' }),
    // validateLength({ min: 2 , message: '项目名称不能少于2个字' })
  ],
  serviceType:[
    validatePresence({ presence: true, message: '项目类型不能为空' })
  ],
  referencePrice:[
    validatePresence({ presence: true, message: '参考价格不能为空' })
  ],
  serviceTime:[
    validatePresence({ presence: true, message: '参考时长不能为空' })
  ],
  frequency:[
    validateNumber({ allowBlank: true, message: '频次必须是数字' })
  ],
};

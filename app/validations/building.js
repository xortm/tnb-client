import {
  validatePresence,
  validateNumber,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '楼宇名称不能为空' })
  ],
  // seq:[
  //   validateNumber({ allowBlank: true, message: '可以为空' }),
  //   // validateNumber({ positive: true, message: '必须是正数' })
  // ],
  upLandFloorNum:[
    validatePresence({ presence: true, message: '地上层数不能为空' }),
    validateNumber({ gte: 1, message: '不能小于1' }),
    validateNumber({ lte: 100, message: '不能大于100'  }),
  ],
  downLandFloorNum:[
    validatePresence({ presence: true, message: '地下层数不能为空' }),
    validateNumber({ lte: 10, message: '不能大于10'  })
  ],
};

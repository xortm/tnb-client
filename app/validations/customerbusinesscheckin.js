import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  checkInPrice:[
    validatePresence({ presence: true, message: '实际价格不能为空' }),
    validateNumber({ integer: true, message: '价格必须为整数'  }),
  ],
  checkInStaff:[
    validatePresence({ presence: true, message: '经办人不能为空' })
  ],
  checkInBed:[
    validatePresence({ presence: true, message: '入住床位不能为空'})
  ],
  inPreference:[
    validatePresence({ presence: true, message: '入住偏好不能为空' })
  ],
  checkInEndTime:[
    validatePresence({ presence: true, message: '入住结束日期不能为空' })
  ],
  checkInStartTime:[
    validatePresence({ presence: true, message: '入住开始日期不能为空' })
  ],
  checkInDate:[
    validatePresence({ presence: true, message: '入住办理日期不能为空' })
  ],
  inContractNO:[
    validatePresence({ presence: true, message: '入住合同编号不能为空' })
  ],
  orderMoney:[
    validatePresence({ presence: true, message: '保证金不能为空' }),
    validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '保证金必须为非零开头的整数' })
  ],
};

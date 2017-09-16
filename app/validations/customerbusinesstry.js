import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {

  experiencePrice:[
    validatePresence({ presence: true, message: '实际价格不能为空' }),
    validateNumber({ integer: true, message: '实际价格必须为整数'  }),
  ],
  experienceStaff:[
    validatePresence({ presence: true, message: '经办人不能为空' })
  ],
  experienceBed:[
    validatePresence({ presence: true, message: '试住床位不能为空'})
  ],
  experienceStartTime:[
    validatePresence({ presence: true, message: '试住开始日期不能为空'})
  ],
  orderInTime:[],
  experienceEndTime:[
    validatePresence({ presence: true, message: '试住结束日期不能为空'})
  ],
  experienceDate:[
    validatePresence({ presence: true, message: '试住办理日期不能为空'})
  ],
  tryContractNO:[
    validatePresence({ presence: true, message: '试住合同编号不能为空'})
  ],
};

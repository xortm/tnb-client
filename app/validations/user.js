import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '姓名不能为空' }),
    validateLength({ min: 2 , message: '姓名不能少于2个字' })
  ],
  loginName:[
    validateFormat({ regex: /(^1(3|4|5|7|8)\d{9}$)/, message: '登陆账号请输入正确的手机号码' })
  ],
  role:[
    validatePresence({ presence: true, message: '系统角色不能为空' })
  ],
  passcode: [
    validatePresence({ presence: true, message: '密码不能为空' }),
    validateLength({ min: 6 , message: '密码不能少于6位' })
  ],
  staffStatus:[
    validatePresence({ presence: true, message: '状态不能为空' })
  ],
};

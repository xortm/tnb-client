import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat,
  validateNumber
} from 'ember-changeset-validations/validators';

export default {
  frequency:[
    validateNumber({ presence: true, message: '频次必须是数字' })
  ],
};

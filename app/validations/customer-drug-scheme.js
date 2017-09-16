import {
    validatePresence,
    validateLength,
    validateConfirmation,
    validateFormat
} from 'ember-changeset-validations/validators';

export default {
    title: [
        validatePresence({
            presence: true,
            message: '标题不能为空'
        }),
    ],
    contents: [
        validatePresence({
            presence: true,
            message: '内容不能为空'
        }),
    ],
};

import {
    validatePresence,
    validateLength,
    validateConfirmation,
    validateFormat
} from 'ember-changeset-validations/validators';

export default {
    // advName: [
    //     validatePresence({
    //         presence: true,
    //         message: '咨询人姓名不能为空'
    //     }),
    //     validateLength({
    //         min: 2,
    //         message: '咨询人姓名不能少于2个字'
    //     })
    // ],
    advTel: [
        validatePresence({
            presence: true,
            message: '咨询人电话不能为空'
        }),
        validateFormat({
            regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            message: '请输入正确的电话号码'
        })
    ],
    // advGender: [
    //     validatePresence({
    //         presence: true,
    //         message: '咨询人性别不能为空'
    //     }),
    // ],
    receiveStaff: [
        validatePresence({
            presence: true,
            message: '接待人不能为空'
        }),
    ],
    advDate: [
        validatePresence({
            presence: true,
            message: '咨询日期不能为空'
        }),
    ],
    // inPreference: [
    //     validatePresence({
    //         presence: true,
    //         message: '入住偏好不能为空'
    //     }),
    // ],
    // advWay: [
    //     validatePresence({
    //         presence: true,
    //         message: '了解渠道不能为空'
    //     }),
    // ],
    consultChannel: [
        validatePresence({
            presence: true,
            message: '咨询方式不能为空'
        }),
    ],
    advName: [
        validatePresence({
            presence: true,
            message: '咨询人姓名不能为空'
        }),
    ],
    // consultRelation: [
    //     validatePresence({
    //         presence: true,
    //         message: '与老人关系不能为空'
    //     }),
    // ],
    liveIntent: [
        validatePresence({
            presence: true,
            message: '咨询意向不能为空'
        }),
    ],
};

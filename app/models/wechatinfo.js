import DS from 'ember-data';

export default DS.Model.extend({
    appId: DS.attr('string'),
    timeStamp: DS.attr('string'),
    nonceStr: DS.attr('string'),
    signature: DS.attr('string'),
    payUrlWithCode: DS.attr('string'),
});

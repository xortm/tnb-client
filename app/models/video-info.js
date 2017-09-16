
import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  fileId: DS.attr('string'),//腾讯云保存文件Id
  playUrl: DS.attr('string'),//视频播放地址
  uploadUser:DS.belongsTo('user'),//上传人
  uploadTime: DS.attr('number'),//上传时间
  expireTime: DS.attr('number'),//过期时间
  fileExistStatus: DS.attr('number'),//云端文件存在状态0否1是
});

import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({

  // 将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  dateFormat: function(date,fmt){
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  //取得当前时间戳
  getCurrentTime: function () {
    return Math.floor(Date.now() / 1000);
  },
  //取得某天的最后一秒的时间戳,参数是日期字符串
  getLastSecondStampOfDayString: function (dateString) {
    console.log('time string',dateString);
    var timeString = dateString + " 23:59:59";
    var time = moment(timeString,"YYYY-MM-DD HH:mm:ss");
    return time.valueOf()/1000;
  },
  getLastSecondStampOfDay: function (date) {
    console.log("date day:",date);
    var dateString = this.dateFormat(date,"yyyy-MM-dd");
    return this.getLastSecondStampOfDayString(dateString);
  },
  //取得某天的第一秒的时间戳,参数是日期字符串
  getFirstSecondStampOfDayString: function (dateString) {
    console.log('time string',dateString);
    var timeString = dateString + " 00:00:00";
    var time = moment(timeString,"YYYY-MM-DD HH:mm:ss");
    return time.valueOf()/1000;
  },
  getFirstSecondStampOfDay: function (date) {
    console.log("date day:",date);
    var dateString = this.dateFormat(date,"yyyy-MM-dd");
    return this.getFirstSecondStampOfDayString(dateString);
  },
  //取得某月的第一天第一秒的时间戳
  getFirstSecondStampOfMonth: function (year,month) {
    var date = this.getFirstDateOfMonth(year,month);
    return this.getFirstSecondStampOfDay(date);
  },
  //取得某月的最后一天最后一秒的时间戳
  getLastSecondStampOfMonth: function (year,month) {
    var date = this.getLastDateOfMonth(year,month);
    return this.getLastSecondStampOfDay(date);
  },
  getFirstDateOfMonth: function(year,month){
    var d = new Date(year, month-1, 1);
    return d;
  },
  getLastDateOfMonth: function(year,month){//忘记year 了？
    var d = new Date(year, month, 0);
    return d;
  },
  //取得某年的第一天第一秒的时间戳
  getFirstSecondStampOfYear: function (year) {
    var date = this.getFirstDateOfMonth(year,1);
    return this.getFirstSecondStampOfDay(date);
  },
  //取得某年的最后一天最后一秒的时间戳
  getLastSecondStampOfYear: function (year) {
    var date = this.getLastDateOfMonth(year,12);
    return this.getLastSecondStampOfDay(date);
  },
  //时间转时间戳
  timeToTimestamp: function (time) {
    console.log('time endTime a time',time);
  	return time.getTime()/1000;
  },
  //字符串转时间戳
  timeStringToTimestamp: function(timeStr) {
    console.log('timeStr in date-service',timeStr);
      if (timeStr.indexOf("T") > 0) {
          var t = timeStr.replace("T", " ");
          timeStr = t;
          console.log("rep timeStr:" + timeStr);
      }
      var time = Date.parse(timeStr.replace(/-/g,"/"));
      return time / 1000;
  },
  //格式化时间,时间戳转字符串
  formatDateT: function(timestamp,formatString) {
    var date = this.timestampToTime(Number(timestamp));
    var dateStringTemp = this.dateFormat(date,formatString);
    var t = dateStringTemp.replace(" ","T");
    return t;
  },
  //格式化时间,时间戳转字符串
  formatDate: function(timestamp,formatString) {
    console.log("timestamp11",timestamp);
  	var date = this.timestampToTime(Number(timestamp));
    console.log("date11",date);
    console.log("date1122",this.dateFormat(date,formatString));
  	return this.dateFormat(date,formatString);
  },
  //时间戳转时间
  timestampToTime: function (timestamp) {
    var offset = new Date().getTimezoneOffset() * 60;
  	var realstamp = timestamp + 480 * 60 + offset;
  	var date = new Date(parseInt(realstamp) * 1000);
  	return date;
  },
  //时间戳转moment时间
  timestampToMoment: function (timestamp) {
    var offset = new Date().getTimezoneOffset() * 60;
  	var realstamp = timestamp + 480 * 60 + offset;
  	return moment(parseInt(realstamp) * 1000);
  },
  //格式化时间,时间戳转格式化的字符串
  datetimeToString: function (timestamp,formatString) {
    var date = this.timestampToTime(timestamp);
  	return this.formatDate(date,formatString);
  },
  //距离当前时间的时间间隔（单位秒）
  getSecondsFromNow: function(unixTimestamp){
    // var moment = this.get("moment");
    var momentRel = moment(unixTimestamp*1000);
    console.log("unixTimestamp:" + unixTimestamp);
    console.log("momentRel:",momentRel);
    console.log("dif is:" + momentRel.diff(moment(), 'seconds'));
    return moment().diff(momentRel, 'seconds');
  },
  //取得当天0点0分0秒的时间戳
  getTodayTimestamp: function(){
    var today = new Date();
    return this.getFirstSecondStampOfDay(today);
  },
  //取得当天最后一秒时间戳
  getTodayLastTimestamp: function(){
    var today = new Date();
    return this.getLastSecondStampOfDay(today);
  },
  //取得几天前0点0分0秒的时间戳
  getDaysBeforeTimestamp: function(beforeNumber){
    var today = new Date();
    var rnumber = beforeNumber * -1;
    var date = moment().add(rnumber, 'day').toDate();
    return this.getFirstSecondStampOfDay(date);
  },
  //把日期格式化为xx年xx月xx日
  formatDateString(date){
      let year = date.getFullYear()+'年';
      let month = (date.getMonth()+1)+'月';
      let day = date.getDate()+'日';
      return year+month+day;
  },
  //获取当前时间是本年的第几周
  theWeek () {
    let totalDays = 0;
    let now = new Date();
    let years = now.getYear();
    if (years < 1000)
        years += 1900;
    var days = new Array(12);
    days[0] = 31;
    days[2] = 31;
    days[3] = 30;
    days[4] = 31;
    days[5] = 30;
    days[6] = 31;
    days[7] = 31;
    days[8] = 30;
    days[9] = 31;
    days[10] = 30;
    days[11] = 31;

    //判断是否为闰年，针对2月的天数进行计算
    if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
        days[1] = 29;
    } else {
        days[1] = 28;
    }

    if (now.getMonth() === 0) {
        totalDays = totalDays + now.getDate();
    } else {
        var curMonth = now.getMonth();
        for (var count = 1; count <= curMonth; count++) {
            totalDays = totalDays + days[count - 1];
        }
        totalDays = totalDays + now.getDate();
    }
    //得到第几周
    var week = Math.ceil(totalDays / 7);
    return week;
  },
  base64_decode(str){
     var c1, c2, c3, c4;
     var base64DecodeChars = new Array(
         -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
         -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
         -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
         58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
         7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
         25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
         37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
         -1, -1
     );
     var i=0, len = str.length, string = '';
     while (i < len){
         do{
             c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
         } while (
             i < len && c1 == -1
         );
         if (c1 == -1) break;
         do{
             c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
         } while (
             i < len && c2 == -1
         );
         if (c2 == -1) break;
          string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
         do{
             c3 = str.charCodeAt(i++) & 0xff;
             if (c3 == 61)
                 return string;
             c3 = base64DecodeChars[c3];
         } while (
             i < len && c3 == -1
         );
         if (c3 == -1) break;
         string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
         do{
             c4 = str.charCodeAt(i++) & 0xff;
             if (c4 == 61) return string;
             c4 = base64DecodeChars[c4];
         } while (
             i < len && c4 == -1
         );
         if (c4 == -1) break;
         string += String.fromCharCode(((c3 & 0x03) << 6) | c4);
     }
     return string;
   },
  base64_encode(str){
         var c1, c2, c3;
         var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
         var i = 0, len= str.length, string = '';

         while (i < len){
             c1 = str.charCodeAt(i++) & 0xff;
             if (i == len){
                 string += base64EncodeChars.charAt(c1 >> 2);
                 string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                 string += "==";
                 break;
             }
             c2 = str.charCodeAt(i++);
             if (i == len){
                 string += base64EncodeChars.charAt(c1 >> 2);
                 string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                 string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                 string += "=";
                 break;
             }
             c3 = str.charCodeAt(i++);
             string += base64EncodeChars.charAt(c1 >> 2);
             string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
             string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
             string += base64EncodeChars.charAt(c3 & 0x3F);
         }
             return string;
     },
});

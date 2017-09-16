var CommonUtil = {
  //扁平结构变树形结构
  Common_flatToTree: function (nodes) {
    var map = {}, node, roots = [];
    for (var i = 0; i < nodes.length; i += 1) {
      node = nodes[i];
      node.children = [];
      map[node.id] = i; // use map to look-up the parents
      console.log("node.parentId:" + node.parentId + " and node.id:" + node.id);
      if (node.parentId && node.parentId !== "0") {
        nodes[map[node.parentId]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    console.log("tree is:", roots);
    return roots;
  },
  Common_endsWith:function(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
  },
  Common_GenerateGuid:function (){
  	var Guid = function(){
  		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  	};
  	return Guid()+Guid()+Guid()+Guid()+Guid()+Guid()+Guid()+Guid();
  },
  clone: function (source,destination) {
    for (var property in source) {
      if (typeof source[property] === "object" && source[property] !== null && destination[property]) {
        this.clone(destination[property], source[property]);
      } else {
        destination[property] = source[property];
      }
    }
  },
  //base64转blob
  b64toBlob: function (b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    if(b64Data.indexOf("base64,")>0){
      b64Data = b64Data.split("base64,")[1];
    }
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  },
  analysisParam: function(url,paras){
    console.log("url is:" + url);
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    console.log("paraString is:" + paraString);
    var paraObj = {};
    var i,j;
    for (i = 0; j = paraString[i]; i++) {
      paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if ( typeof (returnValue) === "undefined") {
      return null;
    } else {
      return returnValue;
    }
  },
  Common_randomNum: function(n){
    var t='';
    for(var i=0;i<n;i++){
      t+=Math.floor(Math.random()*10);
    }
    return t;
  },
};
export default CommonUtil;

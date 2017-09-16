import Ember from 'ember';
import config from '../../config/environment';
export default Ember.Component.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  didInsertElement: function() {
    let data = this.get('data');
    let _self = this;
    let str = '';
    if(data&&data.get('remark')){
      str =  data.get('remark') ;
    }
    $.FroalaEditor.DefineIcon('save', {NAME: 'save'});
    $.FroalaEditor.RegisterCommand('save', {
      title: '保存',
      callback: function () {
        console.log('save');
        _self.sendAction('save',$('#editor-block').froalaEditor('html.get',true));
      }
    });
    if(!this.get('clear')){
      $.FroalaEditor.DefineIcon('clear', {NAME: 'info'});
      $.FroalaEditor.RegisterCommand('clear', {
        title: '预览',
        callback: function () {
          _self.sendAction('saveToRead',$('#editor-block').froalaEditor('html.get',true));
        }
      });
    }

    console.log(this.get("pathConfiger").getEditorRemotePath());
    $('#editor-block').froalaEditor({
      requestWithCORS: true,
      heightMin: 200,
      language: 'zh_cn',
      imageManagerLoadURL:this.get("pathConfiger").getEditorRemotePath(),
      imageUploadURL: this.get("pathConfiger").get("uploadEditorUrl"),
      imageDefaultDisplay: 'inline',
      imageDefaultWidth: 100,
      imageAllowedTypes: ['jpeg', 'jpg', 'png'],
      imageUploadParams: {
                          businessType: 'editorImg',
                          "Content-Type": "image/png",
                          "blob":"application/octet-stream"
                      },
      toolbarButtons:	['fullscreen', 'bold', 'italic', 'underline', '|',
      'fontFamily', 'fontSize', 'color',  'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL',
      'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|',
      'print', 'spellChecker', 'help', '|', 'undo', 'redo','save','clear']
    });
    $('#editor-block').froalaEditor('html.set',str);
    $('#editor-block').on('froalaEditor.image.beforeUpload', function (e, editor, images) {
    console.log('beforeUpload e :',e);
    console.log('beforeUpload editor:',editor);
    console.log('beforeUpload images',images);
    });
    $('#editor-block').on('froalaEditor.image.uploaded', function (e, editor, response) {
    console.log('e:',e);
    console.log('editor:',editor);
    console.log('response',response);
    let img = $('#editor-block').froalaEditor('image.get');
    let src = _self.get("pathConfiger").getEditorRemotePath() + JSON.parse(response).link;
    console.log('cur img src:',img.src,src,img);
    console.log('no change');
    console.log('cur img:',img);
    });
    $('#editor-block').on('froalaEditor.image.inserted', function (e, editor, $img, response) {
  });

    $('#editor-block').on('froalaEditor.imageManager.error', function (e, editor, error, response) {
        console.log(error,'response:',response);
      });
  },
  actions:{
    detailEditClick(){
      this.set('editMode',true);
    },
    cancle(){
      this.sendAction('cancel');
    }
  }
});

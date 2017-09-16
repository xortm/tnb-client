import Ember from 'ember';

export function initialize(appInstance){
    //appInstance.lookup('service:i18n').set('locale', 'en');
}

function calculateLocale() {
  // whatever you do to pick a locale for the user:
  return navigator.language || navigator.userLanguage || 'zh-cn';
}

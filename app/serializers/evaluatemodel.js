import Payload from './payload';

export default Payload.extend({
  attrs: {
    questions: {serialize: 'records' },
    scorescopes: {serialize: 'records' }
  },
  payloadReverse:{
    questions:"model",
    scorescopes:"model"
  }
});

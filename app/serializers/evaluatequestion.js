import Payload from './payload';

export default Payload.extend({
  attrs: {
    answers: {serialize: 'records' }
  },
  payloadReverse:{answers:"question"}
});

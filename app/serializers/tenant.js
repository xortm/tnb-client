import Payload from './payload';

export default Payload.extend({
  attrs: {
    privileges: {serialize: 'records' }
  },
  payloadReverse:{privileges:"tenant"}
});

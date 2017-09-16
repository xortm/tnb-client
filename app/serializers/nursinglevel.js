import Payload from './payload';

export default Payload.extend({
  attrs: {
    services: {serialize: 'records' }
  },
  payloadReverse:{services:"level"}
});

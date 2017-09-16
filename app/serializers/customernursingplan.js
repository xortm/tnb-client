import Payload from './payload';

export default Payload.extend({
  attrs: {
    details: {serialize: 'records' },
  },
  payloadReverse:{details:"plan"}
});

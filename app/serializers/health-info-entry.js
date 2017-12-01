import Payload from './payload';

export default Payload.extend({
  attrs: {
    healths: {serialize: 'records' }
  },
  payloadReverse:{healths:"healthentry"}
});

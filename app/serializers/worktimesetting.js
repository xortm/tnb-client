import Payload from './payload';

export default Payload.extend({
  attrs: {
    beds: {serialize: 'records' }
  },
  payloadReverse:{beds:"setting"}
});

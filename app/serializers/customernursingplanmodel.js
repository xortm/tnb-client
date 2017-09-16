import Payload from './payload';

export default Payload.extend({
  attrs: {
    items: {serialize: 'records' }
  },
  payloadReverse:{items:"plan"}
});

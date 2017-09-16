import Payload from './payload';

export default Payload.extend({
  attrs: {
    schedules: {serialize: 'records' }
  },
  payloadReverse:{schedules:"setting"}
});

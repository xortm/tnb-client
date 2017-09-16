import Payload from './payload';

export default Payload.extend({
  attrs: {
    beds: {serialize: 'records' },
    staffs:{serialize: 'records' }
  },
  payloadReverse:{beds:"group",staffs:"group"}
});

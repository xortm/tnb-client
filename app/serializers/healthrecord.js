import Payload from './payload';

export default Payload.extend({
  attrs: {
    drugallegys: {serialize: 'records' },
    exposurehistorys:{serialize: 'records' },
    diseasehistorys:{serialize: 'records' },
    operationhistorys:{serialize: 'records' },
    injuryhistorys:{serialize: 'records' },
    bloodhistorys:{serialize: 'records' },
    familyhistorys:{serialize: 'records' },
    diseaseconditions:{serialize: 'records' },
  },
  payloadReverse:{
    drugallegys:"healthrecord",
    exposurehistorys:"healthrecord",
    diseasehistorys:"healthrecord",
    operationhistorys:"healthrecord",
    injuryhistorys:"healthrecord",
    bloodhistorys:"healthrecord",
    familyhistorys:"healthrecord",
    diseaseconditions:"healthrecord",
  }

});

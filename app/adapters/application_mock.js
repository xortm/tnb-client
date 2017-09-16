export default DS.JSONAPIAdapter.extend({
  host: 'http://localhost:4200',
  suffix: '.json',
  namespace: 'assets/mockData',
  pathForType: function(type) {
    console.log("pathForType in:" + type);
    return this._super(type) + this.get('suffix');
  }
});

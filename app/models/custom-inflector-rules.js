import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

inflector.uncountable('privilege');
// inflector.irregular('privilege', 'privileges');
inflector.uncountable('task');
inflector.uncountable('worktime');
inflector.uncountable('dicttype');
inflector.uncountable('user');
inflector.uncountable('userTask');
inflector.uncountable('call');
inflector.uncountable('python/call-record');
inflector.uncountable('python/customer');
inflector.uncountable('python/agent');
inflector.uncountable('python/dict-type');
inflector.uncountable('python/subtask');
// Meet Ember Inspector's expectation of an export
export default {};


import Ember from 'ember';
// import TaskItem from './task-item';
import taskItemNodetail from './task-item-nodetail';
import ItemGestures from '../ui/mobile/item-gestures';
const { taskStatus_isPassed,taskStatus_isEnd,taskStatus_begin } = Constants;

export default taskItemNodetail.extend(ItemGestures,{
  isRow: false,
});

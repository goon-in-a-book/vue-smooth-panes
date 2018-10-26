import Vue from 'vue';
import Pane from './Pane.vue';
import PaneSeparator from './PaneSeparator.vue';
import PaneContainer from './PaneContainer.vue';

const Components = {
  Pane,
  PaneSeparator,
  PaneContainer
};

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

export default Components;

<template>
  <div
    class="panel-container"
    ref="mainPanel">
    <slot/>
  </div>
</template>

<script>
import Vue from 'vue';
import PanelSeparator from '@/components/PanelSeparator';

export default {
  name: 'panel-container',
  components: {
    PanelSeparator
  },
  props: {
    direction: {
      required: false,
      type: String,
      default: 'vertical',
      validator: function(value) {
        return ['vertical', 'horizontal'].indexOf(value) !== -1;
      }
    },
    separatorColor: {
      required: false,
      type: String,
      default: 'white'
    },
    dash: {
      required: false,
      type: Boolean,
      default: true
    },
    dashColor: {
      required: false,
      type: String,
      default: 'lightgray'
    },
    separatorWidth: {
      required: false,
      type: Number,
      default: 8
    },
    panelColor: {
      required: false,
      type: String,
      default: 'lightgray'
    }
  },
  data() {
    return {
      panels: [],
      separators: [],
      selectedSeparator: null,
      clickCoords: {
        x: 0,
        y: 0
      },
      initialLengths: {
        left: '0px',
        right: '0px'
      }
    };
  },
  mounted() {
    this.$on('panelClicked', this.panelClicked);
    this.$on('separatorGrabbed', this.separatorGrabbed);

    this.$refs.mainPanel.style.flexDirection =
      this.direction === 'vertical' ? 'column' : 'row';

    let numElements = this.$slots.default.length;
    this.panels = Array.from(this.$slots.default);
    if (this.panels.length === 0) {
      throw 'No panels in panel-container';
    }

    for (let element of this.panels) {
      if (!element.elm.classList.contains('panel')) {
        throw 'Child element of panel-container is not a panel';
      }
      if (!element.componentInstance) {
        throw 'Panel is not a Vue component instance';
      }
    }

    for (let i = 1; i < this.panels.length; i++) {
      let leftPanel = this.panels[i - 1].componentInstance;
      let rightPanel = this.panels[i].componentInstance;
      let separator = this.createSeparator(leftPanel, rightPanel);
      this.$el.insertBefore(separator.$el, rightPanel.$el);
    }
  },
  computed: {
    primaryAxis() {
      return this.direction === 'vertical' ? 'height' : 'width';
    },
    secondaryAxis() {
      return this.direction === 'vertical' ? 'width' : 'height';
    },
    dimension() {
      return this.direction === 'vertical' ? 'clientHeight' : 'clientWidth';
    }
  },
  methods: {
    panelClicked(event) {
      // console.log('clicked');
    },
    separatorGrabbed(event, separator) {
      this.selectedSeparator = separator;
      this.clickCoords = {
        x: event.pageX,
        y: event.pageY
      };

      this.initialLengths = {
        left: separator.leftPanel.$el[this.dimension],
        right: separator.rightPanel.$el[this.dimension]
      };
      document.addEventListener('mousemove', this.dragSeparator);
      document.addEventListener('selectstart', this.disableTextSelect);
      document.addEventListener('mouseup', this.separatorReleased);
    },
    separatorReleased(event) {
      document.removeEventListener('mousemove', this.dragSeparator);
      document.removeEventListener('selectstart', this.disableTextSelect);
      document.removeEventListener('mouseup', this.separatorReleased);
      this.selectedSeparator = null;
    },
    disableTextSelect(event) {
      event.preventDefault();
    },
    createSeparator(leftPanel, rightPanel) {
      let ComponentClass = Vue.extend(PanelSeparator);
      let separator = new ComponentClass({
        parent: this,
        propsData: {
          leftPanel: leftPanel,
          rightPanel: rightPanel
        }
      });
      separator.$mount();
      this.separators.push(separator);
      return separator;
    },
    dragSeparator(event) {
      let diff =
        this.direction === 'vertical'
          ? event.pageY - this.clickCoords.y
          : event.pageX - this.clickCoords.x;

      let panelsLength = this.initialLengths.left + this.initialLengths.right;
      let containerSpace =
        this.$el[this.dimension] - this.separatorWidth * this.separators.length;
      let containerRatio = (panelsLength / containerSpace) * 100;

      let leftRatio = (this.initialLengths.left + diff) / panelsLength;
      leftRatio = Math.min(Math.max(leftRatio, 0), 1);
      let rightRatio = 1 - leftRatio;

      if (this.selectedSeparator.leftPanel.minLength) {
        let minLengthRatio =
          this.selectedSeparator.leftPanel.minLength / panelsLength;
        leftRatio = Math.max(leftRatio, minLengthRatio);
        rightRatio = Math.min(rightRatio, 1 - leftRatio);
      }
      if (this.selectedSeparator.rightPanel.minLength) {
        let minLengthRatio =
          this.selectedSeparator.rightPanel.minLength / panelsLength;
        rightRatio = Math.max(rightRatio, minLengthRatio);
        leftRatio = Math.min(leftRatio, 1 - rightRatio);
      }

      this.selectedSeparator.leftPanel.$el.style[this.primaryAxis] =
        leftRatio * containerRatio + '%';

      this.selectedSeparator.rightPanel.$el.style[this.primaryAxis] =
        rightRatio * containerRatio + '%';
    }
  }
};
</script>

<style>
.panel-container {
  width: 100%;
  height: 100%;
  display: inline-flex;
}
</style>

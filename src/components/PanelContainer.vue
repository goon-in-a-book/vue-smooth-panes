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
    this.panels = this.$slots.default
      .filter(
        element =>
          element.elm.classList.contains('panel') && element.componentInstance
      )
      .map(item => item.componentInstance);

    if (this.panels.length === 0) {
      throw 'No panels in panel-container';
    }

    for (let i = 1; i < this.panels.length; i++) {
      let leftPanel = this.panels[i - 1];
      let rightPanel = this.panels[i];
      let separator = this.createSeparator(leftPanel, rightPanel);
      this.$el.insertBefore(separator.$el, rightPanel.$el);
    }

    this.evenlyDistributeSpace();
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
        left: separator.leftPanel.length(),
        right: separator.rightPanel.length()
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
    containerLength() {
      return this.panels
        .map(panel => panel.$el[this.dimension])
        .reduce((totalLength, length) => totalLength + length);
    },
    freeContainerSpace() {
      return this.panels
        .map(panel => panel.length())
        .reduce((totalLength, length) => totalLength + length);
    },
    dragSeparator(event) {
      let diff =
        this.direction === 'vertical'
          ? event.pageY - this.clickCoords.y
          : event.pageX - this.clickCoords.x;

      let panelsLength = this.initialLengths.left + this.initialLengths.right;
      let containerRatio = panelsLength / this.freeContainerSpace();

      let leftLength = this.initialLengths.left + diff;
      let leftRatio = Math.min(Math.max(leftLength / panelsLength, 0), 1);
      let rightRatio = 1 - leftRatio;

      this.selectedSeparator.leftPanel.$el.style.flexGrow =
        leftRatio * containerRatio;

      this.selectedSeparator.rightPanel.$el.style.flexGrow =
        rightRatio * containerRatio;
    },
    evenlyDistributeSpace() {
      let totalPanelsLength = this.panels.reduce(
        (sum, panel) => sum + panel.length(),
        0
      );

      let freeSpacePixels = this.panels.reduce(
        (space, panel) => space - panel.minLength,
        totalPanelsLength
      );

      let nonDefaultSpace = totalPanelsLength;
      let nonDefaultPanels = [];
      for (let panel of this.panels) {
        if (panel.defaultLength && panel.defaultLength > panel.minLength) {
          nonDefaultSpace -= panel.defaultLength;
          panel.$el.style.flexGrow =
            (panel.defaultLength - panel.minLength) / freeSpacePixels;
          continue;
        }
        nonDefaultPanels.push(panel);
      }

      let remainingPanelLength = nonDefaultSpace;
      let smallRemainingPanels = [];
      let spacePerPanel = remainingPanelLength / nonDefaultPanels.length;

      for (let panel of nonDefaultPanels) {
        if (panel.minLength > spacePerPanel) {
          remainingPanelLength -= panel.minLength;
          panel.$el.style.flexGrow = 0;
          continue;
        }
        smallRemainingPanels.push(panel);
      }

      spacePerPanel = remainingPanelLength / smallRemainingPanels.length;
      for (let panel of smallRemainingPanels) {
        if (panel.minLength > 0) {
          panel.$el.style.flexGrow =
            (spacePerPanel - panel.minLength) / freeSpacePixels;
          continue;
        }
        panel.$el.style.flexGrow = spacePerPanel / freeSpacePixels;
      }
    }
  }
};
</script>

<style>
.panel-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
}
</style>

<template>
  <div class="pane-container" ref="mainPanel">
    <slot/>
  </div>
</template>

<script>
import Vue from "vue";
import PaneSeparator from "@/components/PaneSeparator";

export default {
  name: "pane-container",
  components: {
    PaneSeparator
  },
  props: {
    direction: {
      required: false,
      type: String,
      default: "vertical",
      validator: function(value) {
        return ["vertical", "horizontal"].indexOf(value) !== -1;
      }
    },
    separatorColor: {
      required: false,
      type: String,
      default: "white"
    },
    dash: {
      required: false,
      type: Boolean,
      default: true
    },
    dashColor: {
      required: false,
      type: String,
      default: "lightgray"
    },
    separatorWidth: {
      required: false,
      type: Number,
      default: 8
    },
    paneColor: {
      required: false,
      type: String,
      default: "lightgray"
    }
  },
  data() {
    return {
      panes: [],
      separators: [],
      selectedSeparator: null,
      clickCoords: {
        x: 0,
        y: 0
      },
      initialLengths: {
        left: "0px",
        right: "0px"
      }
    };
  },
  watch: {
    enabledPanes() {
      this.destroySeparators();
      this.createSeparators();
      this.evenlyDistributeSpace();
    }
  },
  mounted() {
    this.$on("paneClicked", this.paneClicked);
    this.$on("separatorGrabbed", this.separatorGrabbed);

    this.$refs.mainPanel.style.flexDirection =
      this.direction === "vertical" ? "column" : "row";

    let numElements = this.$slots.default.length;
    this.panes = this.$slots.default
      .filter(element => {
        return element.tag.includes("pane") && element.componentInstance;
      })
      .map(element => element.componentInstance);

    if (this.panes.length === 0) {
      throw "No panes in pane-container";
    }
  },
  computed: {
    primaryAxis() {
      return this.direction === "vertical" ? "height" : "width";
    },
    secondaryAxis() {
      return this.direction === "vertical" ? "width" : "height";
    },
    dimension() {
      return this.direction === "vertical" ? "clientHeight" : "clientWidth";
    },
    enabledPanes() {
      return this.panes.filter(pane => pane.enabled);
    }
  },
  methods: {
    paneClicked(event) {
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
      document.addEventListener("mousemove", this.dragSeparator);
      document.addEventListener("selectstart", this.disableTextSelect);
      document.addEventListener("mouseup", this.separatorReleased);
    },
    separatorReleased(event) {
      document.removeEventListener("mousemove", this.dragSeparator);
      document.removeEventListener("selectstart", this.disableTextSelect);
      document.removeEventListener("mouseup", this.separatorReleased);
      this.selectedSeparator = null;
    },
    disableTextSelect(event) {
      event.preventDefault();
    },
    destroySeparators() {
      for (let separator of this.separators) {
        let separatorNode = separator.$el;
        separatorNode.remove();
      }
    },
    createSeparators(leftPanel, rightPanel) {
      for (let i = 1; i < this.enabledPanes.length; i++) {
        let leftPanel = this.enabledPanes[i - 1];
        let rightPanel = this.enabledPanes[i];

        let ComponentClass = Vue.extend(PaneSeparator);
        let separator = new ComponentClass({
          parent: this,
          propsData: {
            leftPanel: leftPanel,
            rightPanel: rightPanel
          }
        });
        separator.$mount();
        this.separators.push(separator);
        this.$el.insertBefore(separator.$el, rightPanel.$el);
      }
    },
    containerLength() {
      return this.panes
        .map(pane => pane.$el[this.dimension])
        .reduce((totalLength, length) => totalLength + length);
    },
    freeContainerSpace() {
      return this.panes
        .map(pane => pane.length())
        .reduce((totalLength, length) => totalLength + length);
    },
    dragSeparator(event) {
      let diff =
        this.direction === "vertical"
          ? event.pageY - this.clickCoords.y
          : event.pageX - this.clickCoords.x;

      let panesLength = this.initialLengths.left + this.initialLengths.right;
      let containerRatio = panesLength / this.freeContainerSpace();

      let leftLength = this.initialLengths.left + diff;
      let leftRatio = Math.min(Math.max(leftLength / panesLength, 0), 1);
      let rightRatio = 1 - leftRatio;

      this.selectedSeparator.leftPanel.setFlexGrow(leftRatio * containerRatio);

      this.selectedSeparator.rightPanel.setFlexGrow(
        rightRatio * containerRatio
      );

      this.$emit("resize", event, this.selectedSeparator);
    },
    evenlyDistributeSpace(firstRun = false) {
      let totalPanelsLength = this.enabledPanes.reduce(
        (sum, pane) => sum + pane.length(),
        0
      );

      // Calculate total free distributable space
      let freeSpacePixels = this.enabledPanes.reduce(
        (space, pane) => space - pane.minLength,
        totalPanelsLength
      );

      let nonDefaultSpace = totalPanelsLength;
      let nonDefaultPanels = [];
      for (let pane of this.enabledPanes) {
        if (pane.defaultLength && pane.defaultLength > pane.minLength) {
          nonDefaultSpace -= pane.defaultLength;
          pane.setFlexGrow(
            (pane.defaultLength - pane.minLength) / freeSpacePixels
          );
          continue;
        }
        nonDefaultPanels.push(pane);
      }

      let remainingPanelLength = nonDefaultSpace;
      let smallRemainingPanels = [];
      let spacePerPanel = remainingPanelLength / nonDefaultPanels.length;

      for (let pane of nonDefaultPanels) {
        if (pane.minLength > spacePerPanel) {
          remainingPanelLength -= pane.minLength;
          pane.setFlexGrow(0);
          continue;
        }
        smallRemainingPanels.push(pane);
      }

      spacePerPanel = remainingPanelLength / smallRemainingPanels.length;
      for (let pane of smallRemainingPanels) {
        if (pane.minLength > 0) {
          pane.setFlexGrow((spacePerPanel - pane.minLength) / freeSpacePixels);
          continue;
        }
        pane.setFlexGrow(spacePerPanel / freeSpacePixels);
      }
    }
  }
};
</script>

<style>
.pane-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
}
</style>

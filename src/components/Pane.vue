<template>
  <div
    ref="mainPane"
    :class="{
      'pane': true,
      'pane-hidden': !enabled
    }"
    @click="clickHandler"
  >
    <slot/>
  </div>
</template>

<script>
export default {
  name: "pane",
  props: {
    minLength: {
      type: Number,
      required: false,
      default: 0
    },
    defaultLength: {
      type: Number,
      required: false
    },
    color: {
      type: String,
      required: false,
      default: null
    },
    enabled: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  mounted() {
    this.$el.style.flexBasis = this.minLength + "px";
    this.$el.style[this.$parent.secondaryAxis] = "100%";
    if (this.color) {
      this.$el.style.backgroundColor = this.color;
    } else if (this.$parent.paneColor) {
      this.$el.style.backgroundColor = this.$parent.paneColor;
    }
  },
  methods: {
    clickHandler(event) {
      this.$parent.$emit("paneClicked", event);
    },
    length() {
      return this.$el[this.$parent.dimension] - this.minLength;
    },
    setFlexGrow(value) {
      this.$refs.mainPane.style.flexGrow = value;
    }
  }
};
</script>

<style>
.pane {
  flex-grow: 1;
  overflow: auto;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
  flex-basis: 0;
  flex-shrink: 0;
}

.pane-hidden {
  display: none;
}
</style>
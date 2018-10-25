<template>
  <div
    class="panel" @click="clickHandler">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'panel',
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
    }
  },
  mounted() {
    this.$el.style.flexBasis = this.minLength + 'px';
    this.$el.style[this.$parent.secondaryAxis] = '100%';
    if (this.color) {
      this.$el.style.backgroundColor = this.color;
    } else if (this.$parent.panelColor) {
      this.$el.style.backgroundColor = this.$parent.panelColor;
    }
  },
  methods: {
    clickHandler(event) {
      this.$parent.$emit('panelClicked', event);
    },
    length() {
      return this.$el[this.$parent.dimension] - this.minLength;
    }
  }
};
</script>

<style>
.panel {
  flex-grow: 1;
  overflow: auto;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
  flex-basis: 0;
  flex-shrink: 0;
}
</style>
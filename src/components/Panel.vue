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
      type: String,
      required: false
    },
    maxLength: {
      type: String,
      required: false,
      default: '100%'
    },
    color: {
      type: String,
      required: false,
      default: null
    }
  },
  mounted() {
    this.$el.style['min-' + this.$parent.primaryAxis] = this.minLength + 'px';
    this.$el.style['max-' + this.$parent.primaryAxis] = this.maxLength;
    this.$el.style[this.$parent.secondaryAxis] = '100%';
    if (this.defaultLength) {
      this.$el.style[this.$parent.primaryAxis] = this.defaultLength;
      this.$el.style.flexGrow = '0';
    }
    if (this.color) {
      this.$el.style.backgroundColor = this.color;
    } else if (this.$parent.panelColor) {
      this.$el.style.backgroundColor = this.$parent.panelColor;
    }
  },
  methods: {
    clickHandler(event) {
      this.$parent.$emit('panelClicked', event);
    }
  }
};
</script>

<style>
.panel {
  flex-grow: 1;
  overflow: auto;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
}
</style>
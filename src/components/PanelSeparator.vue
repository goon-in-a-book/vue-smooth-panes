<template>
  <div
    ref="body" 
    class="panel-separator"
    @mousedown="grabbed">
    <div
      ref="dash"
      class="panel-separator-dash"/>
  </div>
</template>

<script>
export default {
  name: 'panel-separator',
  props: {
    leftPanel: {
      type: Object,
      required: true
    },
    rightPanel: {
      type: Object,
      required: true
    }
  },
  mounted() {
    let body = this.$refs.body;
    if (this.$parent.direction === 'vertical') {
      body.classList.add('panel-separator-vertical');
    } else {
      body.classList.add('panel-separator-horizontal');
    }
    body.style[this.$parent.secondaryAxis] = '100%';
    body.style[this.$parent.primaryAxis] = this.$parent.separatorWidth + 'px';
    body.style.flexDirection =
      this.$parent.direction === 'vertical' ? 'row' : 'column';
    body.style.backgroundColor = this.$parent.separatorColor;

    if (this.$parent.dash) {
      let dash = this.$refs.dash;
      dash.style[this.$parent.secondaryAxis] = '10%';
      dash.style[this.$parent.primaryAxis] = '2px';
      dash.style['max-' + this.$parent.secondaryAxis] = '80px';
      dash.style['min-' + this.$parent.secondaryAxis] = '40px';
      if (this.$parent.direction === 'vertical') {
        dash.style.borderTop = '1px solid ' + this.$parent.dashColor;
        dash.style.borderBottom = '1px solid ' + this.$parent.dashColor;
      } else {
        dash.style.borderLeft = '1px solid ' + this.$parent.dashColor;
        dash.style.borderRight = '1px solid ' + this.$parent.dashColor;
      }
      // dash.style.backgroundColor = this.$parent.dashColor;
    }
  },
  methods: {
    grabbed(event) {
      this.$parent.$emit('separatorGrabbed', event, this);
    }
  }
};
</script>

<style scoped>
.panel-separator {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.panel-separator-vertical:hover {
  cursor: row-resize;
}

.panel-separator-horizontal:hover {
  cursor: col-resize;
}

.panel-separator:hover .panel-separator-dash {
  opacity: 1;
}

.panel-separator-dash {
  opacity: 0;
  background-color: none;
  transition: opacity 0.3s;
}
</style>
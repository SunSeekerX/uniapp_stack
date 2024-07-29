<template>
  <svg class="svg-icon" aria-hidden="true" :style="svgStyle">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script>
export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: null,
    },
    size: {
      type: [String, Number],
      default: null,
    },
    width: {
      type: [String, Number],
      default: null,
    },
    height: {
      type: [String, Number],
      default: null,
    },
    unit: {
      type: String,
      default: 'px',
    },
  },
  computed: {
    svgStyle() {
      const style = {}
      if (this.size && this.unit) {
        style['font-size'] = `${this.size}${this.unit}`
      }
      if (this.color) {
        style['color'] = this.color
      }
      if (this.width) {
        style['width'] = `${this.width}${this.unit}`
      }
      if (this.height) {
        style['height'] = `${this.height}${this.unit}`
      }
      return style
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    return { symbolId }
  },
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  fill: currentcolor;
  vertical-align: -0.15em;
}
</style>

<template>
  <div class="hdd-wrap">
    <div class="hdd-control"></div>
    <div class="hdd-canvas">
      <svg
        ref="svg-box"
        class="hdd-svg-box"
        :viewBox="svg.viewBox"
        :width="svg.width"
        :height="svg.height"
        :style="{cursor: svg.cursor}"
        @mousedown="svgMouseDown"
        @wheel="svgMouseWheel"
      >
        <rect x="20" y="80" width="50" height="50" transform="rotate(45)" fill="limegreen" />
        <text x="20" y="20">hello </text>
      </svg>
    </div>
  </div>
</template>


<script>

export default {
  name: 'HommyDiagram',
  data() {
    return {
      isSVGMoveing: false,
      svg: {
        viewBox: '0 0 0 0',
        width: null,
        height: null,
        cursor: 'grab',
      }
    }
  },

  methods: {
    svgMouseDown() {
      this.isSVGMoveing = true
      this.svg.cursor = 'grabbing'
    },

    svgMouseWheel(ev) {
      let [x1, y1, x2, y2] = this.svg.viewBox.split(' ').map(item => Number(item))

      let xTen = x2 * 0.1
      let yTen = y2 * 0.1
      if (ev.deltaY < 0) {// wheel UP
        x2 -= xTen
        y2 -= yTen
      } else {
        x2 += xTen
        y2 += yTen
      }

      this.svg.viewBox = `${x1} ${y1} ${x2} ${y2}`
    },

    moveViewBox(x, y) {
      let [x1, y1, x2, y2] = this.svg.viewBox.split(' ').map(item => Number(item))
      console.log({x, y});
      console.log({x1, y1, x2, y2});
      x1 -= x * 0.5
      y1 -= y * 0.5

      this.svg.viewBox = `${x1} ${y1} ${x2} ${y2}`
    },

    setWH() {
      let rect = this.$refs['svg-box'].getBoundingClientRect()

      let w = rect.width
      let h = rect.height

      this.svg.width = w
      this.svg.height = h
      this.svg.viewBox = `0 0 ${w} ${h}`
    },
  },

  mounted() {
    this.setWH()
    
    window.addEventListener('mouseup', () => {
      this.isSVGMoveing = false
      this.svg.cursor = 'grab'
    })
    window.addEventListener('mousemove', (ev) => {
      if (this.isSVGMoveing === false) return
      this.moveViewBox(ev.movementX, ev.movementY)
    })
  },

}
</script>


<style scoped lang="scss">
.hdd-wrap {
  display: grid;
  grid-template-columns: minmax(20%, 200px) 1fr;
  min-height: 300px;
}


.hdd-canvas {
  $bg-size: 15px;
  $bg-color: #ede7f6;
  $grid-color: #00000014;

  background-image: 
    linear-gradient(to right, $grid-color 1px, transparent 1px), 
    linear-gradient(to bottom, $grid-color 1px, transparent 1px);
  background-size: $bg-size $bg-size;
  background-color: $bg-color;
}
.hdd-svg-box {
  display: block;
  width: 100%;
  height: 100%;

  & * {
    transform-box: border-box;
    transform-origin: center;
  }
}
</style>
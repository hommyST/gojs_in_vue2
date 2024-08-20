<template>
  <div class="hdd-wrap">
    <div class="hdd-control">
      <svg width="400" height="200" version="1.1" viewBox="0 0 1366 768" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke-linejoin="round" stroke-width="3">
          <rect x="51.499" y="307.7" width="269.08" height="126.17" fill="none" stroke="#ff0"/>
          <rect x="636.01" y="251.06" width="366.93" height="118.45" fill="none" stroke="#ff0"/>
          <path id="path2" d="m319.29 381.09s59.223-73.385 139.05-47.636c79.823 25.749 178.96-32.187 178.96-32.187" fill="none" stroke="#f00" stroke-linejoin="round" stroke-width="3"/>
          <text fill="#ffffff" font-family="Broadway" font-size="42.667px" stroke="#ffffff" xml:space="preserve">
            <textPath xlink:href="#path2" :startOffset="offset"><tspan fill="#ffffff" font-family="Arial" stroke="#ffffff">LG</tspan></textPath>
          </text>
        </g>
      </svg>

      <input type="range" v-model="offset" min="10" max="300" step="10">



    </div>


    <div
      class="hdd-canvas"
      ref="svg-box"
      
    >
      <svg
        class="hdd-svg-box"
        :viewBox="svg.viewBox"
        :width="svg.width"
        :height="svg.height"
        :style="{cursor: svg.cursor}"
        @mousedown="svgMouseDown"
        @contextmenu.prevent="showContextMenu"
      >
        <g v-for="(block, key) in blocks" :key="`block-${key}`">
          <!-- wrapper -->
          <rect 
            :x="block.x"
            :y="block.y"
            :width="block.w"
            :height="block.h"
            stroke-width="2"
            fill="#eee"
            stroke="#111"
          />

          <!-- ТЕКСТ -->
          <foreignObject 
            :x="block.x + 1"
            :y="block.y + 20"
            :width="block.w - 4"
            :height="block.h - 22"
          >
            <textarea class="hdd-block-text" xmlns="http://www.w3.org/1999/xhtml">Далеко-далеко за словесными горами в стране гласных и согласных, живут рыбные тексты. Живет последний заголовок моей родного то. Однажды пор рыбными которой города, заглавных встретил речью, напоивший, предложения если щеке над снова.</textarea>
          </foreignObject>

          <!-- Path connections -->
          <g v-for="(connection, cKey) in block.connections" :key="`connection-${cKey}`">
            <path :ref="`path-${block.id}_${cKey}`" :d="getPath(connection)" fill="none" stroke-width="2" stroke="pink" />
          </g>

          <!-- connect to btn -->
          <rect 
            style="cursor: pointer;"
            :x="block.x + block.w / 2 - 5"
            :y="block.y - 5"
            :width="10"
            :height="10"
            fill="blue"
          />

          <!-- connect from btn -->
          <rect 
            style="cursor: pointer;"
            :x="block.x + block.w / 2 - 5"
            :y="block.y + block.h - 5"
            :width="10"
            :height="10"
            fill="green"
            @mousedown.prevent="startNewPath(block)"
          />

        </g>
        <!-- <rect x="20" y="80" width="50" height="50" transform="rotate(45)" fill="limegreen" /> -->
      </svg>
    </div>

    <transition name="fade">
      <div
        v-if="contextMenu.show"
        ref="hdd-context-menu"
        class="hdd-context-menu"
        :style="{top: contextMenu.top + 'px', left: contextMenu.left + 'px'}"
      >
        <ul class="hdd-context-menu--list">
          <li
            @click="addBlock"
            class="hdd-context-menu--list-item"
          >Добавить блок</li>
          <li class="hdd-context-menu--list-item">second</li>
        </ul>
      </div>
    </transition>
  </div>
</template>


<script>

export default {
  name: 'HommyDiagram',
  data() {
    return {
      isSVGMoving: false,
      svg: {
        viewBox: '0 0 0 0',
        width: null,
        height: null,
        cursor: 'grab',
      },
      offset: 10,

      resizeWithDelay: null,
      abortController: null,

      contextMenu: {
        show: false,
        top: 0,
        left: 0,
      },
      currentPosition: {x: 0, y: 0},
      blocks: [
        {id: 0, x: 0, y: 0, w: 300, h: 150, connections: []},
        {id: 1, x: 400, y: 400, w: 300, h: 150, connections: []},
      ],
      isConnectDrawing: false,
      currentConnection: null,
      currentPathId: null,
    }
  },

  methods: {
    init() {
      this.setWH()
      this.resizeWithDelay = this.$utils.debounce(this.setWH, 200)

      // Для удаления слушателя с window
      this.abortController = new AbortController()
      let signal = this.abortController.signal

      window.addEventListener('mouseup', () => {
        this.isSVGMoving = false
        this.svg.cursor = 'grab'
      }, {signal})

      window.addEventListener('mousemove', (ev) => {
        if (this.isSVGMoving === false) return
        this.moveViewBox(ev.movementX, ev.movementY)
      }, {signal})

      window.addEventListener('mouseup', () => {
        if (this.isConnectDrawing === false) return
        this.isConnectDrawing = false // TODO Нарисовать путь
      }, {signal})

      window.addEventListener('mousemove', (ev) => {
        if (this.isConnectDrawing === false) return
        this.drawConnect(ev)
      }, {signal})

      window.addEventListener('resize', () => {
        this.resizeWithDelay()
      }, {signal})

      window.addEventListener('mousedown', ({target}) => {
        let menuElement = target.closest('.hdd-context-menu')

        if (!menuElement) this.contextMenu.show = false
      }, {signal})
    },

    svgMouseDown(ev) {
      if (ev.target.classList.contains('hdd-svg-box') === false) return
      
      this.isSVGMoving = true
      this.svg.cursor = 'grabbing'
    },

    zoomSvg(ev) {
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

    showContextMenu(ev) {
      let target = ev.target
      if (!target.classList.contains('hdd-svg-box')) return
      
      this.contextMenu.show = true
      this.currentPosition.x = ev.offsetX
      this.currentPosition.y = ev.offsetY
  
      setTimeout(() => {
        let {x, y} = ev

        let rect = this.$refs['hdd-context-menu'].getBoundingClientRect()

        let bW = rect.width
        let bH = rect.height

        let gW = window.innerWidth
        let gH = window.innerHeight

        let isLeft = x > gW / 2
        let isTop = y > gH / 2

        if (isLeft) x = x - bW
        if (isTop) y = y - bH

        this.contextMenu.left = x
        this.contextMenu.top = y

      }, 1);

    },


    addBlock() {
      this.contextMenu.show = false
      let [x1, y1] = this.svg.viewBox.split(' ').map(item => Number(item))
      
      let newBlock = {
        id: this.blocks.length + 1,
        x: this.currentPosition.x + x1,
        y: this.currentPosition.y + y1,
        w: 300,
        h: 150,
      }
      this.blocks.push(newBlock)
    },

    drawConnect(ev) {
      let mX = ev.offsetX
      let mY = ev.offsetY

      let pathElement = this.$refs[this.currentPathId][0]
      let len = pathElement?.getTotalLength()
      console.log(len);
      
      
      this.currentConnection.cx1 = this.currentConnection.startx
      this.currentConnection.cy1 = this.currentConnection.starty + len * 0.1

      this.currentConnection.cx2 = mX
      this.currentConnection.cy2 = this.currentConnection.starty + len * 0.1

      this.currentConnection.cx3 = mX
      this.currentConnection.cy3 = mY
    },

    startNewPath(block) {
      let newPath = {
        startx: block.x + block.w / 2,
        starty: block.y + block.h,
        cx1: 0,
        cy1: 0,
        cx2: 0,
        cy2: 0,
        cx3: 0,
        cy3: 0,
      }

      block.connections.push(newPath)
      this.currentConnection = newPath
      this.isConnectDrawing = true
      this.currentPathId = `path-${block.id}_${block.connections.length - 1}`
    },

    getPath(connection) {
      let res = `M ${connection.startx} ${connection.starty} C `
      res += connection.cx1 + ' ' + connection.cy1 + ' '
      res += connection.cx2 + ' ' + connection.cy2 + ' '
      res += connection.cx3 + ' ' + connection.cy3

      return res
    },
  },

  mounted() {
    this.init()
  },

  beforeDestroy() {
    // Удаление слушателей с window
    this.abortController.abort()
  },

}
</script>


<style scoped lang="scss">
.hdd-wrap {
  display: grid;
  grid-template-columns: minmax(20%, 200px) 1fr;
  min-height: 800px;
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
  // height: 100%;

  & * {
    transform-box: border-box;
    transform-origin: center;
  }
}

.hdd-block-text {
	color: #000;
	font-size: 12px;
	letter-spacing: normal;
	text-align: center;
	margin: 0;
	align-content: center;
	resize: none;
	width: 100%;
	border: none;
  padding: 10px;
  height: 100%;

  box-sizing: border-box;
}



// ============CONTEXT MENU
.hdd-context-menu {
  position: fixed;
  background-color: #f0f0f0;
  border-radius: 8px;
  min-width: 250px;
  color: black;
  box-shadow: 0 0 3px #0000005e;
}

.hdd-context-menu--list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.hdd-context-menu--list-item {
  padding: 15px;
  cursor: pointer;
  transition: background-color 120ms;

  &:hover {
    background-color: #ddd;
  }
}











.fade-enter-active, .fade-leave-active {
  transition: opacity 150ms;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
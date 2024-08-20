<template>
  <div class="df_wrapper" @dragstart="startDrag" @dragenter="enterDrag" @dragend="endDrag">
    <div class="df_control">
      <button class="df_control_button mr-3" @click="showAddNode = !showAddNode">Добавить узел</button>

      <div v-if="showAddNode" class="add-node_wrapper">
        <input type="number" v-model.number="addingNode.inputs">
        <input type="number" v-model.number="addingNode.outputs">

        <textarea v-model="addingNode.text"></textarea>

        <button class="df_control_button mr-3" @click="addNode">Добавить</button>
      </div>

      <div class="draggable_nodes">
        <div id="question" draggable="true">Вопрос</div>
      </div>

      <button class="df_control_button" @click="saveJson">test</button>
      <button class="df_control_button" @click="importTest">testImport</button>
    </div>


    <div id="drawflow1" ref="drawflow" @dragover="saveCoord" @drop="test"></div>



    <!-- edit modal -->
    <dialog v-if="showEditModal" open>
      <div class="wrap">
        <input type="number" v-model.number="addingNode.inputs">
        <input type="number" v-model.number="addingNode.outputs">

        <textarea v-model="addingNode.text"></textarea>

        <button class="df_control_button mr-3" @click="editSave">Сохранить</button>
        <button class="df_control_button bg-red" @click="removeNode">Удалить</button>
      </div>
    </dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Drawflow from 'drawflow'


export default {
  name: 'DrawFlow',
  data() {
    return {
      editor: null,
      showAddNode: false,
      addingNode: {
        inputs: 1,
        outputs: 1,
        text: '',
        node: null,
      },

      dragging: {
        el: null,
        over: null,
        x: 0,
        y: 0,
        translateX: 0,
        translateY: 0,
        zoom: 1,
      },

      showEditModal: false,
    }
  },

  methods: {
    initDrawflow() {
      let wrap = document.querySelector('#drawflow1')
      this.editor = new Drawflow(wrap, Vue, this);
      this.editor.start();

      this.editor.on('translate', ({x,y}) => {
        this.dragging.translateX = x
        this.dragging.translateY = y
      })
      this.editor.on('zoom', (zoomLevel) => {
        this.dragging.zoom = zoomLevel
      })
      this.editor.on('contextmenu', ev => {
        const nodeEl = ev.target.closest('.drawflow-node')

        let id = nodeEl.id.replaceAll(/\D/g, '')
        // todo проверка на id

        let node = this.editor.getNodeFromId(id)
        console.log(node);

        this.addingNode.inputs = Object.keys(node.inputs).length
        this.addingNode.outputs = Object.keys(node.outputs).length
        this.addingNode.text = node.html
        this.addingNode.node = node

        


        this.showEditModal = true
      })


      // Пример узла
      const data = {
        name: 'Example Node'
      };

      this.editor.addNode('example', 1, 1, 100, 100, 'example', data, 'Example Node123');
      // this.editor.editor_mode = 'view'
    },

    addNode() {
      const data = {
        name: 'New Node'
      };
      // this.editor.addNode('newNode', 1, 1, 200, 200, 'newNode', data, 'New Node');
      this.editor.addNode('newNode', this.addingNode.inputs, this.addingNode.outputs, 200, 200, 'newNode', data, this.addingNode.text);
    },

    test(ev) {
      console.log(ev);
    },

    startDrag({target}) {
      this.dragging.el = target
    },

    enterDrag({target}) {
      this.dragging.over = target
    },

    endDrag() {
      if (!this.dragging.over.closest('.parent-drawflow')) {
        this.dragging.el = null
        this.dragging.over = null
        return
      }

      const id = this.dragging.el.id
      const x = (this.dragging.x - this.dragging.translateX)
      const y = (this.dragging.y - this.dragging.translateY)
      console.log('dragging', this.dragging.x, this.dragging.y);
      console.log({x, y});

      switch (id) {
        case 'question':

          this.editor.addNode('newNode', 0, 2, x, y, 'newNode', {name: ''}, 'Вопрос');
          break;
      
        default:
          break;
      }
    },

    saveCoord(ev) {
      // ev.preventDefault()
      this.dragging.x = ev.offsetX
      this.dragging.y = ev.offsetY
      
      // console.log(this.dragging.x, this.dragging.y);
    },


    saveJson() {
      let data = this.editor.export()

      console.log(data);
      console.log(data.drawflow.Home.data);
    },


    editSave() {
      //todo connections
      let text = this.addingNode.text
      let inputs = this.addingNode.inputs
      let outputs = this.addingNode.outputs

      let name = this.addingNode.node.name
      let cssClass = this.addingNode.node.class
      let data = this.addingNode.node.data
      let x = this.addingNode.node.pos_x + 10
      let y = this.addingNode.node.pos_y + 10

      this.editor.addNode(name, inputs, outputs, x, y, cssClass, data, text)
      // addConnection(id_output, id_input, output_class, input_class)

      this.showEditModal = false
    },

    removeNode() {
      this.editor.removeNodeId(`node-${this.addingNode.node.id}`)
    },



    importTest() {
      let data = {
        "drawflow": {
          "Home": {
            "data": {
              "1": {
                "id": 1,
                "name": "example",
                "data": {
                  "name": "Example Node"
                },
                "class": "example",
                "html": "Example Node123",
                "typenode": false,
                "inputs": {
                  "input_1": {
                    "connections": [
                      {
                        "node": "2",
                        "input": "output_2"
                      }
                    ]
                  }
                },
                "outputs": {
                  "output_1": {
                    "connections": []
                  }
                },
                "pos_x": 347,
                "pos_y": 181
              },
              "2": {
                "id": 2,
                "name": "newNode",
                "data": {
                  "name": ""
                },
                "class": "newNode",
                "html": "Вопрос",
                "typenode": false,
                "inputs": {},
                "outputs": {
                  "output_1": {
                    "connections": []
                  },
                  "output_2": {
                    "connections": [
                      {
                        "node": "1",
                        "output": "input_1"
                      }
                    ]
                  }
                },
                "pos_x": 64,
                "pos_y": 146
              }
            }
          }
        }
      }

      this.editor.import(data)
    },
  },

  mounted() {
    this.initDrawflow()
  },
}
</script>

<style scoped lang="scss">
.df_wrapper {
  display: grid;
  grid-template-columns: 30% 1fr;
  /* grid-template-rows:  */
}

.df_control {
  padding: 1rem;
}

.df_control_button {
  background: none;
  border: none;
  padding: 0.3em 0.8em;
  text-transform: uppercase;

  background-color: #4caf50;
  color: #fafafa;
  letter-spacing: 1px;
  font-weight: bold;
  border-radius: 3px;
  cursor: pointer;
  transition: filter 200ms;

  &:hover, &:focus-visible {
    filter: brightness(1.2)
  }
  &:active {
    filter: brightness(0.9)
  }

  &.bg-red {
    background-color: #f44336;
  }
}

.add-node_wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-block: 1rem;
}

#question {
  color: black;
  background-color: #90caf9;
  padding: 0.5rem;
}





.mr-3 {
  margin-right: 12px;
}


</style>

<style>
@import url('drawflow/dist/drawflow.min.css');

#drawflow1 {
  /* width: 100%; */
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
}



:root {
  --dfBackgroundColor: #ffffff;
  --dfBackgroundSize: 18px;
  --dfBackgroundImage: linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px);

  --dfNodeType: flex;
  --dfNodeTypeFloat: none;
  --dfNodeBackgroundColor: #ffffff;
  --dfNodeTextColor: #000000;
  --dfNodeBorderSize: 1px;
  --dfNodeBorderColor: #bdbdbd;
  --dfNodeBorderRadius: 4px;
  --dfNodeMinHeight: 40px;
  --dfNodeMinWidth: 160px;
  --dfNodePaddingTop: 15px;
  --dfNodePaddingBottom: 15px;
  --dfNodeBoxShadowHL: 0px;
  --dfNodeBoxShadowVL: 0px;
  --dfNodeBoxShadowBR: 10px;
  --dfNodeBoxShadowS: 0px;
  --dfNodeBoxShadowColor: #222222a1;

  --dfNodeHoverBackgroundColor: #ffffff;
  --dfNodeHoverTextColor: #000000;
  --dfNodeHoverBorderSize: 1px;
  --dfNodeHoverBorderColor: #bdbdbd;
  --dfNodeHoverBorderRadius: 4px;

  --dfNodeHoverBoxShadowHL: 0px;
  --dfNodeHoverBoxShadowVL: 0px;
  --dfNodeHoverBoxShadowBR: 10px;
  --dfNodeHoverBoxShadowS: 0px;
  --dfNodeHoverBoxShadowColor: #4ea9ff;

  --dfNodeSelectedBackgroundColor: rgb(255, 255, 255);
  --dfNodeSelectedTextColor: rgba(0, 0, 0, 1);
  --dfNodeSelectedBorderSize: 1px;
  --dfNodeSelectedBorderColor: #4ea9ff;
  --dfNodeSelectedBorderRadius: 4px;

  --dfNodeSelectedBoxShadowHL: 0px;
  --dfNodeSelectedBoxShadowVL: 0px;
  --dfNodeSelectedBoxShadowBR: 10px;
  --dfNodeSelectedBoxShadowS: 0px;
  --dfNodeSelectedBoxShadowColor: #4ea9ff;

  --dfInputBackgroundColor: #ffffff;
  --dfInputBorderSize: 1px;
  --dfInputBorderColor: rgba(9, 37, 164, 1);
  --dfInputBorderRadius: 50px;
  --dfInputLeft: -27px;
  --dfInputHeight: 12px;
  --dfInputWidth: 12px;

  --dfInputHoverBackgroundColor: #ffffff;
  --dfInputHoverBorderSize: 1px;
  --dfInputHoverBorderColor: rgba(0, 109, 163, 1);
  --dfInputHoverBorderRadius: 50px;

  --dfOutputBackgroundColor: #ffffff;
  --dfOutputBorderSize: 1px;
  --dfOutputBorderColor: #000000;
  --dfOutputBorderRadius: 50px;
  --dfOutputRight: -10px;
  --dfOutputHeight: 13px;
  --dfOutputWidth: 13px;

  --dfOutputHoverBackgroundColor: #ffffff;
  --dfOutputHoverBorderSize: 1px;
  --dfOutputHoverBorderColor: rgba(0, 109, 163, 1);
  --dfOutputHoverBorderRadius: 50px;

  --dfLineWidth: 2px;
  --dfLineColor: #4682b4;
  --dfLineHoverColor: #4682b4;
  --dfLineSelectedColor: #43b993;

  --dfRerouteBorderWidth: 1px;
  --dfRerouteBorderColor: #000000;
  --dfRerouteBackgroundColor: #ffffff;

  --dfRerouteHoverBorderWidth: 2px;
  --dfRerouteHoverBorderColor: #000000;
  --dfRerouteHoverBackgroundColor: #ffffff;

  --dfDeleteDisplay: none;
  --dfDeleteColor: #ffffff;
  --dfDeleteBackgroundColor: #000000;
  --dfDeleteBorderSize: 2px;
  --dfDeleteBorderColor: #ffffff;
  --dfDeleteBorderRadius: 50px;
  --dfDeleteTop: -25px;

  --dfDeleteHoverColor: #000000;
  --dfDeleteHoverBackgroundColor: #ffffff;
  --dfDeleteHoverBorderSize: 2px;
  --dfDeleteHoverBorderColor: #000000;
  --dfDeleteHoverBorderRadius: 50px;

}

#drawflow1 {
  background: var(--dfBackgroundColor);
  background-size: var(--dfBackgroundSize) var(--dfBackgroundSize);
  background-image: var(--dfBackgroundImage);
}

.drawflow .drawflow-node {
  display: var(--dfNodeType);
  background: var(--dfNodeBackgroundColor);
  color: var(--dfNodeTextColor);
  border: var(--dfNodeBorderSize)  solid var(--dfNodeBorderColor);
  border-radius: var(--dfNodeBorderRadius);
  min-height: var(--dfNodeMinHeight);
  width: auto;
  min-width: var(--dfNodeMinWidth);
  padding-top: var(--dfNodePaddingTop);
  padding-bottom: var(--dfNodePaddingBottom);
  -webkit-box-shadow: var(--dfNodeBoxShadowHL) var(--dfNodeBoxShadowVL) var(--dfNodeBoxShadowBR) var(--dfNodeBoxShadowS) var(--dfNodeBoxShadowColor);
  box-shadow:  var(--dfNodeBoxShadowHL) var(--dfNodeBoxShadowVL) var(--dfNodeBoxShadowBR) var(--dfNodeBoxShadowS) var(--dfNodeBoxShadowColor);
}

.drawflow .drawflow-node:hover {
  background: var(--dfNodeHoverBackgroundColor);
  color: var(--dfNodeHoverTextColor);
  border: var(--dfNodeHoverBorderSize)  solid var(--dfNodeHoverBorderColor);
  border-radius: var(--dfNodeHoverBorderRadius);
  -webkit-box-shadow: var(--dfNodeHoverBoxShadowHL) var(--dfNodeHoverBoxShadowVL) var(--dfNodeHoverBoxShadowBR) var(--dfNodeHoverBoxShadowS) var(--dfNodeHoverBoxShadowColor);
  box-shadow:  var(--dfNodeHoverBoxShadowHL) var(--dfNodeHoverBoxShadowVL) var(--dfNodeHoverBoxShadowBR) var(--dfNodeHoverBoxShadowS) var(--dfNodeHoverBoxShadowColor);
}

.drawflow .drawflow-node.selected {
  background: var(--dfNodeSelectedBackgroundColor);
  color: var(--dfNodeSelectedTextColor);
  border: var(--dfNodeSelectedBorderSize)  solid var(--dfNodeSelectedBorderColor);
  border-radius: var(--dfNodeSelectedBorderRadius);
  -webkit-box-shadow: var(--dfNodeSelectedBoxShadowHL) var(--dfNodeSelectedBoxShadowVL) var(--dfNodeSelectedBoxShadowBR) var(--dfNodeSelectedBoxShadowS) var(--dfNodeSelectedBoxShadowColor);
  box-shadow:  var(--dfNodeSelectedBoxShadowHL) var(--dfNodeSelectedBoxShadowVL) var(--dfNodeSelectedBoxShadowBR) var(--dfNodeSelectedBoxShadowS) var(--dfNodeSelectedBoxShadowColor);
}

.drawflow .drawflow-node .input {
  left: var(--dfInputLeft);
  background: var(--dfInputBackgroundColor);
  border: var(--dfInputBorderSize)  solid var(--dfInputBorderColor);
  border-radius: var(--dfInputBorderRadius);
  height: var(--dfInputHeight);
  width: var(--dfInputWidth);
}

.drawflow .drawflow-node .input:hover {
  background: var(--dfInputHoverBackgroundColor);
  border: var(--dfInputHoverBorderSize)  solid var(--dfInputHoverBorderColor);
  border-radius: var(--dfInputHoverBorderRadius);
}

.drawflow .drawflow-node .outputs {
  float: var(--dfNodeTypeFloat);
}

.drawflow .drawflow-node .output {
  right: var(--dfOutputRight);
  background: var(--dfOutputBackgroundColor);
  border: var(--dfOutputBorderSize)  solid var(--dfOutputBorderColor);
  border-radius: var(--dfOutputBorderRadius);
  height: var(--dfOutputHeight);
  width: var(--dfOutputWidth);
}

.drawflow .drawflow-node .output:hover {
  background: var(--dfOutputHoverBackgroundColor);
  border: var(--dfOutputHoverBorderSize)  solid var(--dfOutputHoverBorderColor);
  border-radius: var(--dfOutputHoverBorderRadius);
}

.drawflow .connection .main-path {
  stroke-width: var(--dfLineWidth);
  stroke: var(--dfLineColor);
}

.drawflow .connection .main-path:hover {
  stroke: var(--dfLineHoverColor);
}

.drawflow .connection .main-path.selected {
  stroke: var(--dfLineSelectedColor);
}

.drawflow .connection .point {
  stroke: var(--dfRerouteBorderColor);
  stroke-width: var(--dfRerouteBorderWidth);
  fill: var(--dfRerouteBackgroundColor);
}

.drawflow .connection .point:hover {
  stroke: var(--dfRerouteHoverBorderColor);
  stroke-width: var(--dfRerouteHoverBorderWidth);
  fill: var(--dfRerouteHoverBackgroundColor);
}

.drawflow-delete {
  display: var(--dfDeleteDisplay);
  color: var(--dfDeleteColor);
  background: var(--dfDeleteBackgroundColor);
  border: var(--dfDeleteBorderSize) solid var(--dfDeleteBorderColor);
  border-radius: var(--dfDeleteBorderRadius);
}

.parent-node .drawflow-delete {
  top: var(--dfDeleteTop);
}

.drawflow-delete:hover {
  color: var(--dfDeleteHoverColor);
  background: var(--dfDeleteHoverBackgroundColor);
  border: var(--dfDeleteHoverBorderSize) solid var(--dfDeleteHoverBorderColor);
  border-radius: var(--dfDeleteHoverBorderRadius);
}

</style>

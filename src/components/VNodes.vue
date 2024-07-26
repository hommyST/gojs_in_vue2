<template>
  <div id="vnodes">
    <div class="controls">

      <button @click="test">test</button>
    </div>

    <screen ref="screen">
      <edge v-for="edge in graph.edges" :data="edge" :nodes="graph.nodes" :key="edge.id">
      </edge>

      <!-- html can be placed inside node, defaults to <div>{{node.id}}</div> -->
      <node v-for="node in graph.nodes" :data="node" :key="node.id">
      </node>
    </screen>


  </div>
</template>


<script>
import { Screen, Node, Edge, graph } from 'vnodes'

export default {
  name: 'VNodes',
  components: {
     Screen,
     Node,
     Edge
  },
  data() {
    return {
      graph: new graph()
    }
  },

  methods: {
    init() {
      this.graph.createNode('a')
      this.graph.createNode('b')
      this.graph.createEdge('a', 'b')
      this.graph.graphNodes()
    },

    test() {
      console.log(this.graph);
    }
  },

  mounted() {
    console.log('VNODES');

    this.init()
  },
}
</script>


<style scoped lang="scss">
#vnodes {
  display: grid;
  grid-template-columns: 30% 1fr;
  grid-template-rows: 1fr;

  min-height: 600px;
}
</style>
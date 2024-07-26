<template>
  <div>
    <p>vue-diagrams</p>
    <diagram v-if="model" :model="model"></diagram>
  </div>
</template>
<script>
import { Diagram } from 'vue-diagrams';


export default {
  name: 'VueDiagrams',
  components: {
    Diagram
  },
  
  data() {
    return {
      model: null,
    };
  },

  methods: {
    init() {
      const diagramModel = new Diagram.Model();

      const node1 = diagramModel.addNode("test2", 300, 200);
      const inPort = node1.addInPort("test");

      const node2 = diagramModel.addNode("test", 10, 300, 144, 80);
      const node2OutPort = node2.addOutPort("testOut");
      node2.addOutPort("testOut2");
      node2.color = "#00cc66";

      const node3 = diagramModel.addNode("test3", 10, 100, 72, 100);
      const node3OutPort = node3.addOutPort("testOut3");
      node3.color = "#cc6600";

      diagramModel.addLink(node2OutPort, inPort);
      diagramModel.addLink(node3OutPort, inPort);

      this.model = diagramModel
    },
  },

  mounted() {
    console.log(123);
  },


};
</script>
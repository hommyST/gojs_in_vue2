<template>
  <div id="app">
    <div class="tabs">
      <label style="margin-right: 2rem;">DrawFlow <input type="radio" value="0" v-model.number="tab"></label>
      <label>HommyDiagrams <input type="radio" value="1" v-model.number="tab"></label>
    </div>
    <!-- <V-Nodes /> -->
    <!-- <Vue-Diagrams /> -->
    <!-- <Rete-Js /> -->
    <Draw-Flow v-if="tab === 0" />
    <Hommy-Diagrams v-if="tab === 1" />
  </div>
</template>

<script>
import DrawFlow from './components/DrawFlow.vue'
// import ReteJs from './components/ReteJs.vue'
import VNodes from './components/VNodes.vue'
import HommyDiagrams from './components/HommyDiagrams.vue'
// import VueDiagrams from './components/VueDiagrams.vue'

export default {
  name: 'App',
  components: {
    VNodes,
    DrawFlow,
    // ReteJs,
    // VueDiagrams,
    HommyDiagrams,
  },

  data() {
    return {
      tab: 1,
    }
  }
}
</script>

<style>

</style>

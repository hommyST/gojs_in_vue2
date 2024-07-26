<template>
  <div ref="nodeEditor" style="width: 100%; height: 100%;"></div>
</template>

<script>
import { NodeEditor, Engine, Data } from 'rete';
// import { Engine, Data } from 'rete-engine';

export default {
  name: 'NodeEditor',
  mounted() {
    this.initNodeEditor();
  },
  methods: {
    async initNodeEditor() {
      const container = this.$refs.nodeEditor;
      const editor = new NodeEditor('demo@0.1.0', container);
      const engine = new Engine('demo@0.1.0');

      // Инициализация редактора, добавление узлов и связей

      editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
      });

      // Пример добавления узлов и связей
      // ...

      this.editor = editor;
    }
  }
};
</script>

<style>
/* Стили для редактора узлов */
</style>

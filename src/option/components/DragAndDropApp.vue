<template>
  <div id="option-app">
    <drag-and-drop-option-form id="option-form"
        :option="option"
        @save="saveOptions($event)"
        @reset="resetOptions()"></drag-and-drop-option-form>
  </div>
</template>

<script>
import DragAndDropOptionForm from './DragAndDropOptionForm.vue'
import { saveDragAndDropOptions, readDragAndDropOptions, removeDragAndDropOptions } from '../../common/optionStorage.js'

export default {
  data: function () {
    return {
      option: {}
    }
  },
  components: {
    DragAndDropOptionForm
  },
  methods: {
    saveOptions: async function(option) {
      await saveDragAndDropOptions(option);
      alert("Config Saved!");
    },

    resetOptions: async function() {
      await removeDragAndDropOptions();
      this.option = await readDragAndDropOptions();
    }
  },
  mounted: async function() {
    this.option = await readDragAndDropOptions()
  }
}
</script>

<style scoped>
#option-form {
  width: 700px;
  background-clip: padding-box;
  border: 1px solid rgba(24,26,27,.2);
  box-shadow: 0 3px 5px rgba(24,26,27,.1),0 0 7px rgba(24,26,27,.1);
  box-sizing: content-box;
}
#option-app {
  display: flex;
  justify-content: center;
}
</style>
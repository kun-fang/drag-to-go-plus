<template>
  <div class="panel">
    <header class="panel-section panel-section-header">
      <div class="icon-section-header">
        <img src="drag-to-go-plus-48.png" alt="" style="height: 36px">
      </div>
      <div class="text-section-header">Drag To Go +</div>
    </header>
    <div class="panel-section panel-section-tabs">
      <button class="panel-section-tabs-button"
          v-for="targetType in targetTypes" :key="targetType.name"
          :class="{ selected: selectedType === targetType.name }"
          @click="selectedType = targetType.name">
        {{ targetType.display() }}
      </button>
    </div>
    <div id="form-body" class="panel-section panel-section-formElements">
      <div v-for="targetType in targetTypes" :key="targetType.name">
        <target-option-form
            v-model="option[targetType.name]"
            :type="targetType.name"
            v-if="selectedType === targetType.name"></target-option-form>
      </div>
    </div>
    <div class="panel-section panel-section-formElements">
      <div class="panel-formElements-item">
        <label>
          <input type="checkbox" v-model="option[convertTextToUrl.name]">
          {{ convertTextToUrl.display() }}
        </label>
      </div>
      <div class="panel-formElements-item">
        <label>
          <input type="checkbox" v-model="option[openTabNextToCurrent.name]">
          {{ openTabNextToCurrent.display() }}
        </label>
      </div>
    </div>
    <footer class="panel-section panel-section-footer">
      <button class="panel-section-footer-button default"
          @click="$emit('save', option)">
        Save
      </button>
      <div class="panel-section-footer-separator"></div>
      <button class="panel-section-footer-button"
          @click="$emit('reset')">
        Reset To Default
      </button>
    </footer>
  </div>
</template>

<script>
import { allTargetTypes } from '../../common/target.js'
import { convertTextToUrl, openTabNextToCurrent } from '../../common/display.js'

import TargetOptionForm from './TargetOptionForm.vue'

export default {
  data: function(){
    return {
      targetTypes: allTargetTypes,
      selectedType: allTargetTypes[0].name,
      convertTextToUrl: convertTextToUrl,
      openTabNextToCurrent: openTabNextToCurrent
    }
  },
  components: {
    TargetOptionForm
  },
  props: {
    option: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

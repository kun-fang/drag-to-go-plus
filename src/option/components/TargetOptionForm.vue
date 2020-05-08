<template>
  <div>
    <h4>{{ title.display({target: targetMap[type].display()}) }}</h4>
    <div class="panel">
      <mode-option-form v-model="value.mode"></mode-option-form>
      <div class="panel-section-separator"></div>
      <action-option-form :mode="value.mode"
          :action-group="actionGroup"
          v-model="value.actions" @input="$emit('input', value)"></action-option-form>
    </div>
  </div>
</template>

<script>
import { allActionGroups } from '../../common/actions'

import ModeOptionForm from './ModeOptionForm.vue'
import ActionOptionForm from './ActionOptionForm.vue'
import { targetTitle } from '../../common/display'
import { targetMap } from '../../common/target'

export default {
  data: function() {
    return {
      title: targetTitle,
      targetMap: targetMap,
      actionGroup: allActionGroups.filter(group => group.target === this.type)[0]
    }
  },
  components: {
    ModeOptionForm,
    ActionOptionForm
  },
  props: {
    type: {
      type: String,
      required: true
    },
    value: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
<style scoped>
.panel {
  border: solid 1px grey;
  border-radius: 0.4em;
}
</style>
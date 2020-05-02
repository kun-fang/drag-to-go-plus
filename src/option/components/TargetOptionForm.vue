<template>
  <div>
    <h3 style="text-align: center"><i>{{ title.display({target: targetMap[type].display()}) }}</i></h3>
    <div>
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
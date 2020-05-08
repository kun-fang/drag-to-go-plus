<template>
  <div class="panel-section panel-section-formElements">
    <div class="panel-formElements-item">
      <label>{{ title.display() }}</label>
    </div>
    <div v-for="direction in directions"
        :key="direction.name">
        <action-select :direction="direction"
            :actions="actionGroup.actions"
            :showEngine="actionGroup.showEngine"
            :searchEngines="searchEngines"
            v-model="value[direction.name]" @input="$emit('input', value)"
            :disabled="allowedDirections.indexOf(direction) < 0"></action-select>
    </div>
  </div>
</template>

<script>
import { allDirections, directionGroupMap } from '../../common/direction.js';
import { ActionGroup } from '../../common/actions.js'
import ActionSelection from './ActionSelection.vue'
import { gestureSettingTitle } from '../../common/display';
import { getSearchEngines } from '../../common/constants';
export default {
  components: {
    "action-select": ActionSelection
  },
  data: function() {
    return {
      directions: allDirections,
      directionGroupMap: directionGroupMap,
      searchEngines: [],
      title: gestureSettingTitle
    }
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    actionGroup: {
      type: ActionGroup,
      required: true
    },
    mode: {
      type: String,
      default: "na"
    }
  },
  computed: {
    allowedDirections: function() {
      return this.directionGroupMap[this.mode].directions || []
    }
  },
  mounted: async function() {
    this.searchEngines = await getSearchEngines();
  }
}
</script>
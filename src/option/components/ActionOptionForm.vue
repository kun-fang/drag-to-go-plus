<template>
  <div style="padding-top: 10px">
    <label>{{ title.display() }}</label>
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
    let searchEngines = await browser.search.get();
    this.searchEngines = searchEngines.map(engine => {
      engine.display = engine.name
      if (engine.isDefault) {
        engine.display = `${engine.name} (Default)`
      }
      return engine;
    })
  }
}
</script>
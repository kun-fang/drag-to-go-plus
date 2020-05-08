<template>
  <div class="panel-formElements-item">
    <label class="browser-style">
      <img :src="direction.icon" :alt="direction.name">
    </label>
    <select class="browser-style" v-model="value.action" @input='$emit("input", value)' :disabled="disabled">
      <option :value="action.name" v-for="action in actions" :key="action.name">
        {{ action.display() }}
      </option>
      <option disabled >─────────────────</option>
      <option value="">{{ doNothing.display() }}</option>
    </select>
    <select class="browser-style" v-model="value.stage" @input='$emit("input", value)' :disabled="disabled || disableStage">
      <option :value="stage.name" v-for="stage in stages" :key="stage.name">
        {{ stage.display() }}
      </option>
    </select>
    <select class="browser-style" v-model="value.engine" @input='$emit("input", value)' v-show="showEngine" :disabled="disabled || disableSearch">
      <option :value="engine.name"
          v-for="engine in searchEngines"
          :key="engine.name">
        {{ engine.display }}
      </option>
    </select>
  </div>
</template>

<script>
import { allActionStages, actionMap } from '../../common/actions.js'
export default {
  data: function () {
    return {
      stages: allActionStages,
      actionMap: actionMap,
      doNothing: actionMap[""]
    };
  },
  props: {
    direction: {
      type: Object
    },
    value: {
      type: Object,
      default: () => ({})
    },
    showEngine: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    searchEngines: {
      type: Array
    },
    actions: {
      type: Array,
      default: []
    }
  },
  computed: {
    disableStage: function() {
      let action = this.actionMap[this.value.action];
      return !action || !action.openNewTab;
    },
    disableSearch: function () {
      let action = this.actionMap[this.value.action];
      return !action || !action.isSearch;
    }
  },
  methods: {
    getImageStyle(engine) {
      return `url('${engine.favIconUrl}')`
    }
  }
}
</script>
<style scoped>
select {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  margin-right: 10px
}
</style>
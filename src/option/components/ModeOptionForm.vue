<template>
  <div class="panel-section panel-section-formElements">
    <label>{{ title.display() }}</label>
    <div id="mode-select" class="panel-formElements-item">
      <template v-for="item in directionGroups">
        <input type="radio"
          :checked="item.name === value"
          :value="item.name"
          @change="onChange" :key="item.name + '-radio'">
        <img class="direction-image" :src="item.icon" :key="item.name + '-icon'">
      </template>
    </div>
  </div>
</template>

<script>
import { directionGroups, na } from '../../common/direction.js'
import { gestureDirectionTitle } from '../../common/display';

export default {
  data: function() {
    return {
      directionGroups: directionGroups,
      title: gestureDirectionTitle
    }
  },
  props: {
    value: {
      type: String,
      default: na.name
    }
  },
  methods: {
    onChange(e) {
      return this.$emit('input', e.target.value);
    }
  }
}
</script>

<style scoped>
.direction-image {
  scale: 70%;
  margin-right: 50px;
}
#mode-select {
  justify-content: center;
}
</style>

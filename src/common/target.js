import { TargetType } from './constants.js'

export const targetMap = {};

class Target {
  constructor(target) {
    this.name = target.name;
    this.displayFunction = target.display;
    targetMap[this.name] = this;
  }

  display() {
    return this.displayFunction();
  }
}

const anchor = new Target({
  name: TargetType.ANCHOR,
  display: () => "Links"
});

const image = new Target({
  name: TargetType.IMAGE,
  display: () => "Images"
});

const text = new Target({
  name: TargetType.TEXT,
  display: () => "Text"
});

export const allTargetTypes = [text, anchor, image];

import '../icons/up.png'
import '../icons/down.png'
import '../icons/left.png'
import '../icons/right.png'
import '../icons/move.png'
import '../icons/up-down-icon.png'
import '../icons/left-right-icon.png'
import '../icons/four-directions-icon.png'
import '../icons/close-icon.png'
import '../icons/any-directions-icon.png'

import { toY, fromY, fromX, toX } from './constants';

export const directionGroupMap = {};

class Direction {
  constructor(name, icon) {
    this.name = name;
    this.icon = icon;
  };
}

class DirectionGroup {
  constructor(name, directions, icon, getDirection) {
    this.name = name;
    this.directions = directions;
    this.icon = icon;
    this.directionFunction = getDirection;
    directionGroupMap[name] = this;
  };

  getDirection(data) {
    return this.directionFunction(data);
  }
}

export const up = new Direction("up", "up.png");
export const down = new Direction("down", "down.png");
export const left = new Direction("left", "left.png");
export const right = new Direction("right", "right.png");
export const any = new Direction("any", "move.png");

export const upDown = new DirectionGroup(
  "up-down",
  [up, down],
  "up-down-icon.png",
  (data) => data[toY] <= data[fromY] ? up : down);
  
export const leftRight = new DirectionGroup(
  "left-right",
  [left, right],
  "left-right-icon.png",
  (data) => data[toX] <= data[fromX] ? left : right);

export const fourDirections = new DirectionGroup(
  "four-directions",
  [up, down, left, right],
  "four-directions-icon.png",
  (data) => {
    let [x, y] = [(data[toX] - data[fromX]) || 0.1, (data[toY] - data[fromY]) || 0.1];
    let tan = Math.abs(1.0 * y / x);
    if (tan >= 1) {
      return y <= 0 ? up : down;
    } else {
      return x <= 0 ? left : right;
    }
  });

export const anyMode = new DirectionGroup(
  "any",
  [any],
  "any-directions-icon.png",
  (data) => any);

export const na = new DirectionGroup(
  "na",
  [],
  "close-icon.png",
  (data) => undefined);

export const allDirections = [any, up, down, left, right];
export const directionGroups = [upDown, leftRight, fourDirections, anyMode, na];

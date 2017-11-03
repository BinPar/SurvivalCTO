/* global PIXI */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-mixed-operators */
import getTexture from './getTexture';
import player from '../../../engine/sound/player';
import store from '../../../store';

const minX = 64 - 200;
const maxX = 1460 + 200;

export default class Bimbo {
  constructor(container) {
    this.container = container;
    this.frame = 0;
    this.texture = getTexture('bimbo').clone();
    this.sprite = new PIXI.Sprite(this.texture);
    this.scale = 0.35;
    this.spriteRects = new Array(7).fill(0).map((v, i) => new PIXI.Rectangle(i * 153, 0, 153, 222));
    this.texture.frame = this.spriteRects[0];
    this.container.addChild(this.sprite);
    this.sprite.aspectRatio = this.sprite.width / this.sprite.height;
    this.sprite.x = 750;
    this.sprite.scale.set(this.scale, this.scale);
    this.horizontalSpeed = 1;
    this.x = 0;
    this.walkX = Math.random() * (maxX - minX) + minX;
    this.frameSpeed = 0.005 * Math.random() + 0.003;
    this.lastStunt = 0;
  }

  render(state) {
    this.frame += state.lastFrameTime * this.frameSpeed * 1.5;
    this.sprite.alpha = Math.max(state.night * 10, 0);
    if (!this.stunned) {
      this.walkX += state.lastFrameTime * this.frameSpeed * 10 * this.horizontalSpeed;
    }
    const frame = Math.floor(this.frame) % 6;
    if (this.horizontalSpeed > 0) {
      this.sprite.scale.set(this.scale, this.scale);
    } else if (this.horizontalSpeed < 0) {
      this.sprite.scale.set(-this.scale, this.scale);
    }
    this.x -= this.sprite.width * this.sprite.scale.x;

    this.sprite.y = this.y + 74;
    this.sprite.x = this.x + this.walkX;

    if (
      state.player.floor === 1 &&
      this.stunned &&
      state.player.stunnedByBimbo &&
      Math.random() < (state.totalTime - this.lastStunt - 15) / 20
    ) {
      this.stunned = false;
      this.lastStunt = state.totalTime;
      state.player.stunned = false;
      state.player.stunnedByBimbo = false;
      player.fx.flirt.stop();
      if (!state.player.sleeping && !state.player.stunned && !state.player.elevator) {
        if (state.pressedKeys.KeyD && !state.pressedKeys.KeyA) {
          store.dispatch({ type: 'walk', payload: 1 });
        } else if (state.pressedKeys.KeyA && !state.pressedKeys.KeyD) {
          store.dispatch({ type: 'walk', payload: -1 });
        }
      }
    }

    if (
      state.player.floor === 1 &&
      state.totalTime - this.lastStunt > 2 &&
      Math.abs(this.sprite.x + (this.horizontalSpeed === 1 ? 25 : -25) - state.player.x) < 20 &&
      Math.abs(this.sprite.y - (90 + state.player.jumpY)) < 40 &&
      !state.player.sleeping &&
      this.sprite.alpha > 0.5 &&
      !state.player.stunned &&
      !state.player.elevator
    ) {
      this.lastStunt = state.totalTime;
      state.player.stunned = true;
      state.player.stunnedByBimbo = true;
      this.stunned = true;
      player.fx.flirt.play();
      if (this.sprite.x + (this.horizontalSpeed === 1 ? 25 : -25) > state.player.x) {
        this.horizontalSpeed = -1;
        this.walkX += 10;
      } else {
        this.horizontalSpeed = 1;
        this.walkX -= 10;
      }
      store.dispatch({ type: 'stop' });
    }

    if (state.player.stunnedByBimbo && this.stunned) {
      this.texture.frame = this.spriteRects[0];
    } else {
      this.texture.frame = this.spriteRects[frame];
    }

    if (this.sprite.x > maxX) {
      this.horizontalSpeed = -1;
    }

    if (this.sprite.x < minX) {
      this.horizontalSpeed = 1;
    }
  }
}

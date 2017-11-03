/* global PIXI */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-mixed-operators */
import getTexture from './getTexture';

export default class Player {
  constructor(container) {
    this.container = container;
    this.frame = 0;

    this.beheaded = getTexture('beheaded');
    this.scale = 0.35;
    this.beheadedRects = new Array(20)
      .fill(0)
      .map((v, i) => new PIXI.Rectangle(i * 140, 0, 140, 400));
    this.beheaded.frame = this.beheadedRects[0];
    this.dying = new PIXI.Sprite(this.beheaded);
    this.scale = 0.35;
    this.dying.aspectRatio = this.dying.width / this.dying.height;
    this.dying.x = 750;
    this.dying.y = -1 * this.dying.height;
    this.dying.scale.set(0.3, 0.3);

    this.texture = getTexture('marcos');
    this.sprite = new PIXI.Sprite(this.texture);

    this.spriteRects = new Array(7).fill(0).map((v, i) => new PIXI.Rectangle(i * 153, 0, 153, 222));
    this.texture.frame = this.spriteRects[0];

    this.container.addChild(this.sprite);
    this.sprite.aspectRatio = this.sprite.width / this.sprite.height;
    this.sprite.x = 750;
    this.sprite.y = -1 * this.sprite.height;
    this.sprite.scale.set(this.scale, this.scale);

    this.laying = new PIXI.Sprite(getTexture('marcos-laying'));
    this.laying.scale.set(this.scale, this.scale);
    this.laying.x = this.sprite.x;
    this.laying.y = this.sprite.y;
    this.container.addChild(this.laying);
    this.laying.visible = false;

    this.bubble = new PIXI.Sprite(getTexture('bubble'));
    this.bubble.x = this.sprite.x;
    this.bubble.y = this.sprite.y;
    this.container.addChild(this.bubble);
    this.bubble.visible = false;

    this.clock = new PIXI.Sprite(getTexture('clock'));
    this.clock.x = this.sprite.x;
    this.clock.y = this.sprite.y;
    this.container.addChild(this.clock);
    this.clock.visible = false;
    this.water = new PIXI.Sprite(getTexture('water'));
    this.water.x = this.sprite.x;
    this.water.y = this.sprite.y;
    this.container.addChild(this.water);
    this.empty = new PIXI.Sprite(getTexture('water-empty'));
    this.empty.x = this.sprite.x;
    this.empty.y = this.sprite.y;
    this.container.addChild(this.empty);
    this.empty.visible = false;
    this.sad = new PIXI.Sprite(getTexture('sad'));
    this.sad.x = this.sprite.x;
    this.sad.y = this.sprite.y;
    this.container.addChild(this.sad);
    this.sad.visible = false;
    this.bimbo = new PIXI.Sprite(getTexture('heart'));
    this.bimbo.x = this.sprite.x;
    this.bimbo.y = this.sprite.y;
    this.container.addChild(this.bimbo);
    this.bimbo.visible = false;
    this.container.addChild(this.dying);
  }

  render(stage) {
    this.dying.visible = stage.player.dying !== -1;
    let dyingFrame = stage.player.dying * 2 - 10;
    dyingFrame = Math.floor(Math.min(Math.max(dyingFrame, 0), 19));
    this.beheaded.frame = this.beheadedRects[dyingFrame];
    this.bubble.visible =
      stage.player.alarm ||
      stage.player.water ||
      stage.player.stunnedByVictor ||
      stage.player.stunnedByBimbo;
    this.clock.visible = stage.player.alarm && stage.player.dying === -1;
    this.water.visible =
      stage.player.water &&
      !stage.player.stunnedByVictor &&
      !stage.player.empty &&
      stage.player.dying === -1;
    this.empty.visible =
      stage.player.water &&
      !stage.player.stunnedByVictor &&
      stage.player.empty &&
      stage.player.dying === -1;
    this.sad.visible = stage.player.stunnedByVictor && stage.player.dying === -1;
    this.bimbo.visible = stage.player.stunnedByBimbo && stage.player.dying === -1;
    this.sprite.visible =
      !stage.player.elevator && !stage.player.sleeping && stage.player.dying === -1;
    this.laying.visible = stage.player.sleeping && !stage.player.inBed && stage.player.dying === -1;
    if (stage.player.walking) {
      const frameSpeed = stage.player.speed * 0.06;
      this.frame += stage.lastFrameTime * frameSpeed;
    }
    const frame = Math.floor(this.frame) % 6;
    let x = stage.player.x;
    if (stage.player.horizontalSpeed > 0) {
      this.sprite.scale.set(this.scale, this.scale);
    } else if (stage.player.horizontalSpeed < 0) {
      this.sprite.scale.set(-this.scale, this.scale);
    }
    x -= this.sprite.width * this.sprite.scale.x;
    this.texture.frame = this.spriteRects[stage.player.walking ? frame : 6];
    this.y = stage.player.floor * -160;
    this.y += 40;
    if (stage.player.floor === 1) {
      this.y += 10;
    } else if (stage.player.floor === stage.floors.length) {
      this.y -= 5;
    } else {
      this.y -= 5;
    }

    this.y += stage.player.jumpY;
    this.sprite.y = this.y;
    stage.player.y = this.y;
    this.sprite.x = x;
    this.laying.x = stage.player.x - 50;
    this.laying.y = this.sprite.y + 50;
    this.bubble.x = stage.player.x - (stage.player.sleeping ? 30 : 0);
    this.bubble.y = this.sprite.y - (stage.player.sleeping ? 40 : 72);
    if (stage.player.inBed) {
      this.bubble.x = 1320;
      this.bubble.y -= 10;
    }
    this.dying.x = stage.player.x - 25;
    this.dying.y = this.sprite.y - 40;
    this.clock.x = this.bubble.x + 30;
    this.clock.y = this.bubble.y + 6;
    this.water.x = this.bubble.x + 30;
    this.water.y = this.bubble.y + 6;
    this.empty.x = this.bubble.x + 30;
    this.empty.y = this.bubble.y + 6;
    this.sad.x = this.bubble.x + 27;
    this.sad.y = this.bubble.y + 6;
    this.bimbo.x = this.bubble.x + 27;
    this.bimbo.y = this.bubble.y + 6;
  }
}

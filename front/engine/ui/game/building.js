/* eslint-env browser */
/* eslint-disable no-param-reassign */
/* global PIXI */
import Floor from './floor';
import getTexture from './getTexture';
import Player from './player';
import player from '../../../engine/sound/player';

export default class Building {
  constructor(stage) {
    this.stage = stage;
    this.container = new PIXI.Container();
    this.background = new PIXI.Container();
    this.characters = new PIXI.Container();
    this.foreground = new PIXI.Container();
    this.container.addChild(this.background);
    this.container.addChild(this.characters);
    this.container.addChild(this.foreground);
    this.player = new Player(this.characters);
  }

  render(state) {
    if (!this.floors) {
      this.stage.addChild(this.container);
      this.sideWalks = new Array(75).fill(0).map(() => new PIXI.Sprite(getTexture('sidewalk')));
      this.sideWalks.forEach((sideWalk) => {
        sideWalk.y = sideWalk.height * -0.5;
      });
      this.sideWalks.forEach(sideWalk => this.background.addChild(sideWalk));
      let y = this.sideWalks[0].height / -2;
      this.floors = state.floors.map(
        (floor, num) => new Floor(this.background, floor, num, this.foreground),
      );
      this.floors.forEach((floor) => {
        y -= floor.container.height;
        floor.container.y = y;
        floor.foregroundContainer.y = y;
        this.player.sprite.y = floor.container.y;
      });
      this.width = this.container.width;
      this.sideWalks.forEach((sideWalk, num) => {
        let x = sideWalk.width - 1.5;
        x *= num;
        x -= 1500;
        sideWalk.x = x;
      });
    } else if (this.floors.length !== state.floors.length) {
      player.fx.newFloor.play();
      this.floors.splice(1, 0, new Floor(this.background, state.floors[1], 1, this.foreground));
      let y = this.sideWalks[0].height / -2;
      this.floors.forEach((floor, num) => {
        floor.num = num + 1;
        floor.container.num = num + 1;
        if (floor.victor) {
          floor.victor.num = num + 1;
        }
        if (floor.num === 2) {
          floor.container.y = y;
        }
        y -= floor.container.height;
      });
      this.background.children = this.background.children.sort((a, b) => (a.num < b.num ? 1 : -1));
    }
    let y = this.sideWalks[0].height / -2;
    this.floors.forEach((floor) => {
      y -= floor.container.height;
      if (floor.container.y !== y) {
        if (floor.container.y < y) {
          floor.container.y = y;
          floor.foregroundContainer.y = y;
        } else {
          floor.container.y -= state.lastFrameTime * 0.5;
          floor.foregroundContainer.y = floor.container.y;
        }
      }
    });
    this.sideWalks.forEach((sideWalk) => {
      sideWalk.tint = state.lightTint;
    });
    this.floors.forEach(floor => floor.render(state));
    this.player.render(state);
  }
}

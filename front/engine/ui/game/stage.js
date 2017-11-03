/* eslint-env browser */
/* global PIXI */
/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */
import getTexture from './getTexture';
import store from '../../../store';
import Building from './building';

export default class Stage {
  constructor(renderer) {
    this.renderer = renderer;
    this.pixiStage = new PIXI.Container();
    this.bgDay = new PIXI.Sprite(getTexture('bg-day'));
    this.bgNight = new PIXI.Sprite(getTexture('bg-night'));
    this.pixiStage.addChild(this.bgDay);
    this.pixiStage.addChild(this.bgNight);
    this.building = new Building(this.pixiStage);
    this.building.container.scale.set(0.8, 0.8);
    this.resize = this.resize.bind(this);
    this.blur = new PIXI.filters.ZoomBlurFilter();
    this.displaceMap = new PIXI.Sprite(getTexture('displaceMap'));
    this.displacement = new PIXI.filters.DisplacementFilter(this.displaceMap);
    this.pixiStage.addChild(this.displaceMap);
    this.displaceMap.scale.x = 4;
    this.displaceMap.scale.y = 4;
    this.colorMatrix = new PIXI.filters.ColorMatrixFilter();
    this.colorMatrix.matrix = [
      1.5,
      -0.15,
      -0.15,
      -0.15,
      -0.15,
      -0.15,
      1.5,
      -0.15,
      -0.15,
      -0.15,
      -0.15,
      -0.15,
      1.5,
      -0.15,
      -0.15,
      -0.1,
      -0.15,
      -0.15,
      1.5,
      -0.15,
    ];
    this.colorMatrix.alpha = 0;
    this.pixiStage.filters = [this.blur, this.displacement, this.colorMatrix];

    this.resize(window.innerWidth, window.innerHeight);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.bgDay.width = width * 1.2;
    this.bgDay.height = height * 1.2;
    this.bgDay.x = -width * 0.1;
    this.bgDay.y = -height * 0.1;

    this.bgNight.width = width * 1.2;
    this.bgNight.height = height * 1.2;
    this.bgNight.x = -width * 0.1;
    this.bgNight.y = -height * 0.1;

    this.building.minY = height;
    this.building.container.y = height;
    if (this.building.container.width) {
      this.building.container.x = width / 2;
      this.building.container.x -= 761 / 2;
    }
    this.vScroll = 0;
  }

  render() {
    const state = store.getState();
    if (state.totalTime) {
      this.blur.strength = 0.04 * state.hud.levels.alcohol;
      this.displacement.scale.x = state.hud.levels.alcohol * 10;
      this.displacement.scale.y = state.hud.levels.alcohol * 10;
      let displaceBaseX = Math.sin(state.totalTime / 1.5);
      let displaceBaseY = Math.cos(state.totalTime / 1.5);
      this.building.container.y = this.height + this.vScroll;
      displaceBaseX *= 500;
      displaceBaseY *= 500;
      const dying = Math.min(state.player.dying, 10);
      const bilisZoom = state.hud.levels.bile / 10 + 0.4 + dying / 10;
      this.colorMatrix.alpha = (state.hud.levels.bile / 10) ** 2 + 0.1;
      this.building.container.scale.set(bilisZoom + 0.8, bilisZoom + 0.8);
      this.displaceMap.x = displaceBaseX - 500;
      this.displaceMap.y = displaceBaseY - 500;
      this.bgNight.alpha = state.night;
      this.renderer.render(this.pixiStage);
      this.building.render(state);
      this.building.container.x = this.width / 2;
      this.building.container.x -= 761 * this.building.container.scale.x;
      let startPlayer = state.player.x - 761;
      startPlayer *= this.building.container.scale.x * 1.5;
      this.building.container.x -= startPlayer / 2 * (1 + (state.player.dying + 1) / 80);

      const playerRelX = state.player.x * this.building.container.scale.x;
      const playerRelY = state.player.y * this.building.container.scale.y;
      this.blur.center = [
        this.building.container.x + playerRelX,
        this.building.container.y + playerRelY + 40,
      ];

      if (this.blur.center[1] < 240) {
        this.vScroll += state.lastFrameTime * 0.5;
      }

      const maxScrollY = 80 * this.building.container.scale.x;
      if (this.blur.center[1] > this.height - maxScrollY) {
        this.vScroll -= state.lastFrameTime * 0.5;
      }
    }
    if (!this.building.container.x) {
      this.resize(window.innerWidth, window.innerHeight);
    }
  }
}

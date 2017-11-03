/* eslint-env browser */
/* global PIXI */

import React from 'react';
import 'pixi.js';
import 'pixi-filters';
import Stage from './stage';
import player from '../../sound/player';
import resources from './resources';
import store from '../../../store';
import HUD from './hud';

export default class Game extends React.Component {
  componentDidMount() {
    store.dispatch({
      type: 'newGame',
    });
    if (process.browser && PIXI) {
      PIXI.utils.skipHello();
      this.renderer = new PIXI.WebGLRenderer(256, 256);
      this.renderer.view.style.position = 'absolute';
      this.renderer.view.style.display = 'block';
      this.renderer.autoResize = true;
      this.running = true;
      this.renderer.resize(window.innerWidth, window.innerHeight);
      this.onkeydown = this.onkeydown.bind(this);
      this.onkeyup = this.onkeyup.bind(this);
      document.body.appendChild(this.renderer.view);
      window.onresize = () => {
        this.renderer.resize(window.innerWidth, window.innerHeight);
        if (this.stage) this.stage.resize(window.innerWidth, window.innerHeight);
      };
      this.renderLoop = this.renderLoop.bind(this);
      if (!window.resourcesLoaded) {
        resources.forEach(fileName => PIXI.loader.add(`/static/img/${fileName}`));
        this.onResourcesLoaded = this.onResourcesLoaded.bind(this);
        PIXI.loader.load(this.onResourcesLoaded);
      } else {
        this.onResourcesLoaded();
      }
    }
  }

  componentDidUpdate() {
    store.dispatch({
      type: 'newGame',
    });
  }

  componentWillUnmount() {
    this.renderer.destroy(true);
    this.running = false;
    document.onkeydown = null;
    document.onkeyup = null;
    window.onresize = null;
  }

  onResourcesLoaded() {
    window.resourcesLoaded = true;
    player.setBackgroundMusic('stage');
    document.onkeydown = this.onkeydown;
    document.onkeyup = this.onkeyup;
    this.stage = new Stage(this.renderer);
    this.renderLoop();
    this.pressedKeys = {};
  }

  onkeydown(ev) {
    if (!this.pressedKeys[ev.code]) {
      this.pressedKeys[ev.code] = true;
      const state = store.getState();
      store.dispatch({ type: 'pressedKeys', payload: this.pressedKeys });
      const playerActive =
        !state.player.sleeping &&
        !state.player.stunned &&
        !state.player.playing &&
        !state.player.coding &&
        !state.player.elevator;
      switch (ev.code) {
        case 'KeyA':
          if (!playerActive || this.pressedKeys.KeyD) {
            store.dispatch({ type: 'stop' });
          } else {
            store.dispatch({ type: 'walk', payload: -1 });
          }
          break;
        case 'KeyD':
          if (!playerActive || this.pressedKeys.KeyA) {
            store.dispatch({ type: 'stop' });
          } else {
            store.dispatch({ type: 'walk', payload: 1 });
          }
          break;
        case 'KeyW':
          if (playerActive) {
            store.dispatch({ type: 'jump' });
          } else if (state.player.elevator) {
            store.dispatch({ type: 'elevatorUp' });
          }
          break;
        case 'KeyS':
          if (state.player.elevator) {
            store.dispatch({ type: 'elevatorDown' });
          }
          break;
        default:
          break;
      }
    }
  }

  onkeyup(ev) {
    if (this.pressedKeys[ev.code]) {
      const state = store.getState();
      const playerActive =
        !state.player.sleeping &&
        !state.player.stunned &&
        !state.player.playing &&
        !state.player.coding &&
        !state.player.elevator;
      this.pressedKeys[ev.code] = false;
      store.dispatch({ type: 'pressedKeys', payload: this.pressedKeys });
      switch (ev.code) {
        case 'KeyA':
          if (playerActive && this.pressedKeys.KeyD) {
            store.dispatch({ type: 'walk', payload: 1 });
          } else {
            store.dispatch({ type: 'stop' });
          }
          break;
        case 'KeyD':
          if (playerActive && this.pressedKeys.KeyA) {
            store.dispatch({ type: 'walk', payload: -1 });
          } else {
            store.dispatch({ type: 'stop' });
          }
          break;
        case 'KeyW':
          if (playerActive) {
            store.dispatch({ type: 'jump' });
          }
          break;
        default:
          break;
      }
    }
  }

  renderLoop(ev) {
    if (this.running) requestAnimationFrame(this.renderLoop);
    if (!ev) {
      this.lapsed = 0;
      this.time = 0;
    } else {
      if (this.time === 0) {
        this.startTime = ev;
        this.time = ev;
      }
      this.lapsed = ev - this.time;
      this.time = ev;

      store.dispatch({
        type: 'newFrame',
        payload: { totalTime: this.time - this.startTime, lastFrameTime: this.lapsed },
      });

      this.stage.render();
    }
  }

  render() {
    return <HUD store={store} />;
  }
}

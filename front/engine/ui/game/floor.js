/* global PIXI */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-param-reassign */
import getTexture from './getTexture';
import store from '../../../store';
import player from '../../../engine/sound/player';
import Victor from './victor';
import Bimbo from './bimbo';

export default class Floor {
  constructor(container, data, num, foreground) {
    this.building = container;
    this.foreground = foreground;
    this.num = num + 1;
    this.data = data;
    this.foregroundContainer = new PIXI.Container();
    this.container = new PIXI.Container();
    this.container.num = this.num;

    let texture = this.data.type === 'bar' ? 'bars' : 'office';
    if (this.data.type === 'home') {
      texture = 'roof';
    }
    this.leftWall = new PIXI.Sprite(getTexture(texture));
    this.container.addChild(this.leftWall);
    this.leftWall.aspectRatio = this.leftWall.width / this.leftWall.height;
    this.elevatorBack = new PIXI.Sprite(getTexture('elevator-inside'));
    this.container.addChild(this.elevatorBack);
    this.elevatorBack.aspectRatio = this.elevatorBack.width / this.elevatorBack.height;
    this.elevatorBack.x = this.leftWall.width - 1.1;

    this.elevatorOff = new PIXI.Sprite(getTexture('elevator'));
    this.elevatorOn = new PIXI.Sprite(getTexture('elevator-on'));
    if (this.data.type === 'home') {
      this.laying = new PIXI.Sprite(getTexture('marcos-laying'));
      this.laying.scale.set(0.33, 0.33);
      this.laying.x = this.leftWall.width + 620;
      this.laying.y = 98;
      this.laying.visible = false;
    }
    this.marcos = new PIXI.Sprite(getTexture('marcos-stop'));
    this.marcos.scale.set(0.33, 0.33);
    this.marcos.x = this.leftWall.width + 55;
    this.marcos.y = 65;
    this.marcos.visible = false;

    this.elevatorDoorA = new PIXI.Sprite(getTexture('elevator-door'));
    this.elevatorDoorB = new PIXI.Sprite(getTexture('elevator-door'));
    this.elevatorDoorA.y = 36;
    this.elevatorDoorB.y = 36;
    this.elevatorDoorA.x = this.leftWall.width + 8;
    this.container.addChild(this.marcos);
    this.container.addChild(this.elevatorDoorB);
    this.container.addChild(this.elevatorDoorA);
    this.container.addChild(this.elevatorOn);
    this.container.addChild(this.elevatorOff);
    this.elevatorOn.aspectRatio = this.elevatorOn.width / this.elevatorOn.height;
    this.elevatorOn.x = this.leftWall.width;
    this.elevatorOff.aspectRatio = this.elevatorOff.width / this.elevatorOff.height;
    this.elevatorOff.x = this.leftWall.width - 1.1;

    if (this.data.type === 'home') {
      texture = 'flat';
    }
    this.rightWall = new PIXI.Sprite(getTexture(texture));
    this.container.addChild(this.rightWall);
    this.rightWall.aspectRatio = this.rightWall.width / this.rightWall.height;

    if (this.data.type !== 'home') {
      this.rightWall.scale.set(-1, 1);
      this.rightWall.x = this.elevatorOff.x + this.elevatorOff.width + this.rightWall.width;
    } else {
      this.rightWall.scale.set(1, 1);
      this.rightWall.x = this.elevatorOff.x + this.elevatorOff.width;
    }
    if (this.data.type === 'home') {
      this.container.addChild(this.laying);
      this.pcGammer = new PIXI.Sprite(getTexture('gaming-station'));
      this.pcGammer.x = 900;
      this.pcGammer.y += 2;
      this.foregroundContainer.addChild(this.pcGammer);
    }

    if (this.data.type === 'bar') {
      this.bimbos = [];
      this.bimbos.push(new Bimbo(this.foregroundContainer, this.num));
      const pos = [-550, -300, 300, 550];
      this.bars = pos.map(() => ({
        off: new PIXI.Sprite(getTexture('bar-off')),
        on: new PIXI.Sprite(getTexture('bar')),
      }));

      this.bars.forEach((bar, i) => {
        this.container.addChild(bar.off);
        this.container.addChild(bar.on);
        bar.on.x = this.leftWall.width + pos[i];
        bar.off.x = this.leftWall.width + pos[i];
        bar.on.visible = false;
      });
    }

    if (this.data.type === 'binPar') {
      const pos = [-550, -375, -200, 200, 375, 550];

      this.programmes = pos.map(() => ({
        off: new PIXI.Sprite(getTexture('programmer-off')),
        on: new PIXI.Sprite(getTexture('programmer')),
        error: new PIXI.Sprite(getTexture('programmer-red')),
        working: false,
      }));

      this.victor = new Victor(this.foregroundContainer, this.num);

      this.programmes.forEach((programmer, i) => {
        this.foregroundContainer.addChild(programmer.off);
        this.foregroundContainer.addChild(programmer.on);
        this.foregroundContainer.addChild(programmer.error);
        const displacement = 0; // Math.random() * 80 - 40;
        programmer.on.x = this.leftWall.width + pos[i] + displacement;
        programmer.off.x = this.leftWall.width + pos[i] + displacement;
        programmer.error.x = this.leftWall.width + pos[i] + displacement;
        programmer.off.visible = false;
        programmer.on.visible = false;
        programmer.error.visible = false;
        programmer.on.y = 2;
        programmer.off.y = 2;
        programmer.error.y = 2;
        programmer.fail = false;
      });
      this.bathRoom = new PIXI.Sprite(getTexture('bathroom'));
      this.container.addChild(this.bathRoom);
      this.bathRoomOpen = new PIXI.Sprite(getTexture('bathroom-open'));
      this.container.addChild(this.bathRoomOpen);
      this.bathRoomOpen.visible = false;
      this.coffeeMaker = new PIXI.Sprite(getTexture('coffee-maker'));
      this.container.addChild(this.coffeeMaker);
      this.coffeeMakerEmpty = new PIXI.Sprite(getTexture('coffee-maker-empty'));
      this.container.addChild(this.coffeeMakerEmpty);
      this.coffeeMaker.x = 1390;
      this.coffeeMakerEmpty.x = 1390;
    }

    this.lastStunt = -60000;
    this.building.addChild(this.container);
    this.foreground.addChild(this.foregroundContainer);
    this.powerUps = new PIXI.Container();
    this.foregroundContainer.addChild(this.powerUps);
    this.powerUpItems = [];
    this.drinking = false;
    this.totalWater = 10;
  }

  render(state) {
    let open = 0;

    if (this.data.type === 'binPar') {
      if (
        state.player.x > this.bathRoom.x &&
        state.player.x < this.bathRoom.x + this.bathRoom.width * 0.6 &&
        this.num === state.player.floor &&
        state.pressedKeys.Space &&
        !state.player.sleeping &&
        !state.player.stunned
      ) {
        this.bathRoomOpen.visible = true;
        if (state.player.water && state.player.empty) {
          state.player.empty = false;
          player.fx.fill.play();
        }
      } else {
        this.bathRoomOpen.visible = false;
      }

      if (
        this.coffeeMaker.visible &&
        state.player.x > this.coffeeMaker.x + 30 &&
        state.player.x < this.coffeeMaker.x + 90 &&
        this.num === state.player.floor &&
        state.pressedKeys.Space &&
        !state.player.sleeping &&
        !state.player.stunned &&
        !this.drinking
      ) {
        if (Math.random() > this.totalWater / 10) {
          this.coffeeMaker.visible = false;
          state.player.water = true;
          state.player.empty = true;
          player.fx.drop.play();
        } else {
          this.drinking = true;
          player.fx.coffee.play();
          state.hud.levels.sleep -= 0.2;
          this.totalWater -= Math.random() / 2 + 0.2;
        }
      }
      if (
        !this.coffeeMaker.visible &&
        state.player.x > this.coffeeMaker.x + 30 &&
        state.player.x < this.coffeeMaker.x + 90 &&
        this.num === state.player.floor &&
        state.pressedKeys.Space &&
        !state.player.sleeping &&
        !state.player.stunned &&
        state.player.water &&
        !state.player.empty
      ) {
        player.fx.refill.play();
        state.player.water = false;
        this.totalWater = 10;
        this.coffeeMaker.visible = true;
      }

      if (!state.pressedKeys.Space || state.player.x < this.coffeeMaker.x + 30) {
        this.drinking = false;
      }

      this.victor.render(state);
      this.victor.y = this.foreground.y;
      this.victor.x = this.foreground.x;
      if (state.hud.time.h > 8 && state.hud.time.h < 18 && state.hud.time.m !== this.lastMinute) {
        if (Math.random() < 0.005) {
          const redBull = new PIXI.Sprite(getTexture('redbull'));
          this.powerUpItems.push(redBull);
          this.powerUps.addChild(redBull);
          redBull.x = 20 + 1440 * Math.random();
          redBull.y = 5 + 110 * Math.random();
        }
      }
      if (this.num === state.player.floor) {
        const usedItems = [];

        this.powerUpItems.forEach((item) => {
          if (
            Math.abs(item.x - state.player.x) < 20 &&
            Math.abs(item.y - (90 + state.player.jumpY)) < 40 &&
            !state.player.sleeping &&
            !state.player.stunned &&
            !state.player.elevator
          ) {
            store.dispatch({ type: 'redBull' });
            usedItems.push(item);
          }
        });
        this.powerUpItems = this.powerUpItems.filter(item => usedItems.indexOf(item) === -1);
        this.powerUps.children = this.powerUpItems;
      }
      this.programmes.forEach((programmer) => {
        if (!programmer.off.visible && state.hud.time.h > 5) {
          programmer.off.visible = true;
        }

        if (
          state.hud.time.h > 8 &&
          state.hud.time.h < 18 &&
          !programmer.working &&
          state.hud.time.m !== this.lastMinute
        ) {
          if (Math.random() < 0.06) {
            programmer.working = true;
          }
        }
        if (
          state.hud.time.h > 18 ||
          (state.hud.time.h < 8 && programmer.working && state.hud.time.m !== this.lastMinute)
        ) {
          if (Math.random() < 0.005 && !programmer.fail) {
            programmer.working = false;
          }
        }
        if (
          programmer.working &&
          state.hud.time.m !== this.lastMinute &&
          !programmer.fail &&
          state.player.programmersFailing < 2 + state.level
        ) {
          programmer.fail =
            Math.random() < (state.totalTime - state.player.lastProgrammerFail) / 10000;
          if (programmer.fail) {
            player.fx.newError.play();
            state.player.programmersFailing += 1;
            state.player.lastProgrammerFail = state.totalTime;
          }
        }

        if (programmer.fail && programmer.fixing) {
          if (Math.random() < 0.01) {
            programmer.fail = false;
            programmer.fixing = false;
            player.fx.typing.stop();
            player.fx.errorFixed.play();
            state.player.programmersFailing -= 1;
            store.dispatch({ type: 'scoreUp', payload: (10 - state.hud.levels.bile) * 10 });
          }
        }
        const lastValue = programmer.on.visible;
        programmer.on.visible = programmer.working ? Math.random() > 0.001 : false;
        if (programmer.on.visible && !lastValue) player.fx.officeLights.play();
        programmer.error.visible = programmer.fail ? Math.random() > 0.001 : false;

        if (this.num === state.player.floor && programmer.error.visible) {
          if (
            state.player.x > programmer.on.x + 20 &&
            state.player.x < programmer.on.x + programmer.on.width - 20 &&
            state.pressedKeys.Space &&
            !state.player.sleeping &&
            !state.player.stunned
          ) {
            if (!programmer.fixing) {
              player.fx.typing.play();
              programmer.fixing = true;
            }
          } else if (programmer.fixing) {
            player.fx.typing.stop();
            programmer.fixing = false;
          }
        }
      });
    }

    if (this.data.type === 'bar') {
      if (this.bimbos.length - 2 < state.level) {
        this.bimbos.push(new Bimbo(this.foregroundContainer, this.num));
      }
      this.bimbos.forEach((bimbo) => {
        bimbo.y = this.foreground.y + 18;
        bimbo.x = this.foreground.x;
        bimbo.render(state);
      });
      this.bars.forEach((bar) => {
        const lastValue = bar.on.visible;
        bar.on.visible = Math.random() * state.night > 0.01;
        if (bar.on.visible && !lastValue) {
          player.fx.barLights.stop();
          player.fx.barLights.play();
        }
      });

      if ((state.hud.time.h < 4 || state.hud.time.h > 18) && state.hud.time.m !== this.lastMinute) {
        if (Math.random() < 0.01) {
          const gin = new PIXI.Sprite(getTexture('gin'));
          this.powerUpItems.push(gin);
          this.powerUps.addChild(gin);
          gin.x = 10 - 200 + 1850 * Math.random();
          gin.y = 5 + 110 * Math.random();
        }
      }
      if (this.num === state.player.floor) {
        const usedItems = [];

        this.powerUpItems.forEach((item) => {
          if (
            Math.abs(item.x - state.player.x) < 20 &&
            Math.abs(item.y - (90 + state.player.jumpY)) < 40 &&
            !state.player.sleeping &&
            !state.player.stunned &&
            !state.player.elevator
          ) {
            store.dispatch({ type: 'gin' });
            usedItems.push(item);
          }
        });
        this.powerUpItems = this.powerUpItems.filter(item => usedItems.indexOf(item) === -1);
        this.powerUps.children = this.powerUpItems;
      }
    }

    if (this.data.type === 'home') {
      this.pcGammer.tint = state.totalTime - this.lastStunt > 60 ? 0xffffff : 0xcccccc;
      if (this.num === state.player.floor) {
        if (
          state.player.x > 1296 &&
          state.pressedKeys.Space &&
          !state.player.sleeping &&
          !state.player.stunned &&
          state.hud.levels.sleep > 4
        ) {
          store.dispatch({ type: 'sleep', payload: 'bed' });
        }
      }

      if (this.num === state.player.floor) {
        if (
          state.player.x > 950 &&
          state.player.x < 1000 &&
          state.pressedKeys.Space &&
          !state.player.sleeping &&
          !state.player.stunned &&
          state.totalTime - this.lastStunt > 60
        ) {
          state.player.stunned = true;
          state.player.playing = true;
          player.fx.wakeOK.play();
          store.dispatch({ type: 'speedUp' });
          player.setBackgroundMusic('playing');
          this.lastStunt = state.totalTime;
        }
      }

      if (
        this.lastMinute !== state.hud.time.m &&
        state.player.playing &&
        this.lastMinute % 60 === 0
      ) {
        if (Math.random() < (state.totalTime - this.lastStunt) / 500) {
          state.timeSpeed = 0.004;
          state.player.stunned = false;
          state.player.playing = false;
          player.setBackgroundMusic('stage');
          player.fx.wakeOK.play();
          this.lastStunt = state.totalTime;
        } else {
          player.fx.wakeKO.play();
        }
      }
      this.laying.visible = state.player.sleeping && state.player.inBed;
    }
    if (this.elevatorOn) {
      this.marcos.visible = state.player.elevator && this.num === state.player.floor;
      if (this.num === state.elevator.floor) {
        open = state.elevator.open;
        this.elevatorOn.visible = true;
        this.elevatorOff.visible = false;
      } else {
        this.elevatorOn.visible = false;
        this.elevatorOff.visible = true;
      }
      this.elevatorDoorA.x = 8 + this.leftWall.width + 36 * (1 - open);
      this.elevatorDoorB.x = 8 + this.leftWall.width + 72 * (1 - open);
      if (this.num === state.player.floor) {
        if (
          state.player.x > this.elevatorOn.x + 60 &&
          state.player.x < this.elevatorOn.x + this.elevatorOn.width - 60 &&
          state.pressedKeys.Space &&
          !state.player.sleeping &&
          !state.player.water &&
          !state.player.stunned
        ) {
          if (open === 1 && !state.elevator.opening && !state.elevator.closing) {
            state.player.elevator = true;
            state.elevator.closing = true;
            player.fx.elevatorDoor.play();
            store.dispatch({ type: 'stop' });
          }
        }

        if (state.pressedKeys.Space && state.player.elevator) {
          if (open === 0 && !state.elevator.opening && !state.elevator.closing) {
            state.elevator.opening = true;
            player.fx.elevatorDoor.play();
          }
        } else if (
          open === 1 &&
          !state.elevator.opening &&
          !state.elevator.closing &&
          state.player.elevator
        ) {
          state.player.elevator = false;
          if (state.pressedKeys.KeyD && !state.pressedKeys.KeyA) {
            store.dispatch({ type: 'walk', payload: 1 });
          } else if (state.pressedKeys.KeyA && !state.pressedKeys.KeyD) {
            store.dispatch({ type: 'walk', payload: -1 });
          }
        }
      }
    }
    this.lastMinute = state.hud.time.m;
    if (this.leftWall) this.leftWall.tint = state.lightTint;
    if (this.rightWall) this.rightWall.tint = state.lightTint;
    if (this.elevatorOff) this.elevatorOff.tint = state.lightTint;
    if (this.elevatorOn) this.elevatorOn.tint = state.lightTint;
    if (this.elevatorDoorA) this.elevatorDoorA.tint = state.lightTint;
    if (this.elevatorDoorB) this.elevatorDoorB.tint = state.lightTint;
    if (this.bathRoom) this.bathRoom.tint = state.lightTint;
    if (this.bathRoomOpen) this.bathRoomOpen.tint = state.lightTint;
    if (this.coffeeMaker) this.coffeeMaker.tint = state.lightTint;
    if (this.coffeeMakerEmpty) this.coffeeMakerEmpty.tint = state.lightTint;
  }
}

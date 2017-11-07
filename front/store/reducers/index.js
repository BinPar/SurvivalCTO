/* eslint-disable no-mixed-operators */
/* eslint-disable no-param-reassign */
import Router from 'next/router';
import initialState from './initialState';
import player from '../../engine/sound/player';

const baseTimeSpeed = 0.004;
const fastTimeSpeed = 0.02;
const startTime = 11;
const minX = 44;
const maxX = 1480;

export default (state = { ...JSON.parse(JSON.stringify(initialState)) }, { type, payload }) => {
  const playerActive =
    !state.player.sleeping &&
    !state.player.stunned &&
    !state.player.playing &&
    !state.player.coding &&
    !state.player.elevator;

  switch (type) {
    case 'newGame':
      return { ...JSON.parse(JSON.stringify(initialState)), timeSpeed: baseTimeSpeed };
    case 'scoreUp':
      return {
        ...state,
        hud: {
          ...state.hud,
          score: state.hud.score + payload,
        },
      };
    case 'scoreDown':
      return {
        ...state,
        hud: {
          ...state.hud,
          score: state.hud.score - payload,
        },
      };
    case 'speedUp':
      return { ...state, timeSpeed: fastTimeSpeed };
    case 'slowDown':
      return { ...state, timeSpeed: baseTimeSpeed };
    case 'sleep':
      player.setBackgroundMusic('sleeping');
      if (playerActive) {
        return {
          ...state,
          timeSpeed: fastTimeSpeed,
          player: {
            ...state.player,
            walking: false,
            sleeping: true,
            inBed: payload === 'bed',
            sleepStart: state.totalTime,
          },
        };
      }
      return {
        ...state,
      };
    case 'wakeUp':
      player.setBackgroundMusic('stage');
      return {
        ...state,
        timeSpeed: baseTimeSpeed,
        player: { ...state.player, walking: false, sleeping: false, inBed: false },
      };
    case 'pressedKeys':
      return { ...state, pressedKeys: payload };
    case 'setFloor':
      return {
        ...state,
        player: {
          ...state.player,
          floor: payload,
        },
      };
    case 'elevatorUp':
      if (
        state.elevator.floor < state.floors.length &&
        !state.elevator.opening &&
        !state.elevator.closing &&
        state.elevator.open === 0 &&
        state.player.elevator
      ) {
        player.fx.elevator.play();
        const floor = state.elevator.floor + 1;
        return {
          ...state,
          elevator: {
            ...state.elevator,
            floor,
          },
          player: {
            ...state.player,
            floor,
          },
        };
      }
      return {
        ...state,
      };
    case 'elevatorDown':
      if (
        state.elevator.floor > 1 &&
        !state.elevator.opening &&
        !state.elevator.closing &&
        state.elevator.open === 0 &&
        state.player.elevator
      ) {
        player.fx.elevator.play();
        const floor = state.elevator.floor - 1;
        return {
          ...state,
          elevator: {
            ...state.elevator,
            floor,
          },
          player: {
            ...state.player,
            floor,
          },
        };
      }
      return {
        ...state,
      };
    case 'walk':
      player.fx.walk.play();
      return {
        ...state,
        player: {
          ...state.player,
          walking: true,
          horizontalSpeed: payload,
        },
      };
    case 'stop':
      player.fx.walk.stop();
      return {
        ...state,
        player: {
          ...state.player,
          walking: false,
          horizontalSpeed: 0,
        },
      };
    case 'jump':
      if (!state.player.jumping && playerActive) {
        player.fx.walk.stop();
        player.fx.jump.play();
        return {
          ...state,
          player: {
            ...state.player,
            verticalSpeed: 2,
            jumpY: 0,
            jumping: true,
          },
        };
      }
      return { ...state };
    case 'redBull':
      player.fx.redBull.play();
      return {
        ...state,
        hud: {
          ...state.hud,
          levels: {
            ...state.hud.levels,
            sleep: Math.max(state.hud.levels.sleep - 0.25, 0),
          },
        },
      };
    case 'gin':
      player.fx.gin.play();
      return {
        ...state,
        hud: {
          ...state.hud,
          levels: {
            ...state.hud.levels,
            sleep: Math.min(state.hud.levels.sleep + 0.5, 10),
            alcohol: state.hud.levels.alcohol < 9 ? state.hud.levels.alcohol + 1 : 10,
            bile: Math.max(state.hud.levels.bile - 1, 0),
          },
        },
      };
    case 'newFrame': {
      let timeSpeed = state.timeSpeed;
      const totalTime = state.totalTime + payload.lastFrameTime * timeSpeed;
      let totalMins = Math.floor(totalTime);
      totalMins += startTime * 60;
      const night = Math.min(Math.max(Math.sin(Math.PI * ((150 + totalMins) / 720)) * 2, 0), 1);
      let lightTint = 0.3 * night;
      lightTint = 1 - lightTint;
      lightTint *= 255;
      const lightTintBase = Math.round(lightTint);
      lightTint = lightTintBase;
      lightTint *= 256;
      lightTint += lightTintBase;
      lightTint *= 256;
      lightTint += lightTintBase;
      let newLevel = Math.floor((totalMins - 360) / 1440) + 1;
      const frameTime = payload.lastFrameTime * timeSpeed;
      const time2PerH = frameTime * 0.03;
      const time15PerH = frameTime * 0.02;
      const time03PerH = frameTime * 0.005;
      const time06PerH = frameTime * 0.009;
      const floors = state.floors;
      let playerFloor = state.player.floor;

      const elevator = state.elevator;
      if (newLevel > 1 && newLevel !== state.level) {
        floors.splice(1, 0, {
          type: 'binPar',
        });
        if (playerFloor > 1) playerFloor += 1;
        if (elevator.floor > 1) elevator.floor += 1;
      } else {
        newLevel = state.level;
      }
      let playerX = state.player.x;
      if (state.player.walking) {
        playerX += state.player.horizontalSpeed * payload.lastFrameTime * state.player.speed * 1.2;
      }
      const maxXForFloor = state.player.floor === state.floors.length ? 1383 : maxX;
      const minXForFloor = state.player.floor === state.floors.length ? 344 : minX;

      let sleeping = state.player.sleeping;
      let walking = state.player.walking;
      let inBed = state.player.inBed;
      let sleepStart = state.player.sleepStart;
      let stunned = state.player.stunned;
      let dying = state.player.dying;
      let exploded = state.player.exploded;
      if (dying !== -1) {
        dying += payload.lastFrameTime * timeSpeed;
        if (dying > 5 && !state.player.exploded) {
          exploded = true;
          player.fx.explosion.play();
        }
        if (dying > 20) {
          dying = -1;
          Router.push('/');
        }
      }

      if (state.hud.levels.bile === 10 && playerActive) {
        stunned = true;
        walking = false;
        dying = 0;
        player.fx.walk.stop();
        player.bg.gameOver.stop();
        player.bg.gameOver.play();
        player.setBackgroundMusic('gameOver');
      }

      if (state.hud.levels.sleep === 10 && playerActive && !state.player.sleeping) {
        sleeping = true;
        timeSpeed = fastTimeSpeed;
        player.setBackgroundMusic('sleeping');
        walking = false;
        sleepStart = totalTime;
        player.fx.walk.stop();
      }

      let alarm = state.player.alarm;
      if (state.player.sleeping && totalTime - sleepStart > 60 && !alarm) {
        alarm = true;
        player.fx.alarm.play();
      }
      if (state.hud.levels.sleep === 0 && state.player.sleeping) {
        sleeping = false;
        walking = false;
        inBed = false;
        alarm = false;
        player.fx.alarm.stop();
        timeSpeed = baseTimeSpeed;
        player.setBackgroundMusic('stage');
      }
      if (state.player.floor === 1) {
        playerX = Math.max(playerX, minXForFloor - 500);
        playerX = Math.min(playerX, maxXForFloor + 500);
      } else {
        playerX = Math.max(playerX, minXForFloor);
        playerX = Math.min(playerX, maxXForFloor);
      }

      if (alarm && state.pressedKeys.Space) {
        const res = Math.random() * 10;
        sleepStart = totalTime;
        state.pressedKeys.Space = false;
        alarm = false;
        player.fx.alarm.stop();
        if (res > state.hud.levels.sleep + state.hud.levels.alcohol) {
          sleeping = false;
          walking = false;
          inBed = false;
          player.setBackgroundMusic('stage');
          timeSpeed = 0.004;
          player.fx.wakeOK.play();
        } else {
          player.fx.wakeKO.play();
        }
      }
      let verticalSpeed = state.player.verticalSpeed;
      let jumpY = state.player.jumpY;
      let jumping = state.player.jumping;

      if (elevator.opening) {
        elevator.open = Math.min(1, elevator.open + payload.lastFrameTime * elevator.doorSpeed);
        if (elevator.open === 1) {
          elevator.opening = false;
        }
      } else if (elevator.closing) {
        elevator.open = Math.max(0, elevator.open - payload.lastFrameTime * elevator.doorSpeed);
        if (elevator.open === 0) {
          elevator.closing = false;
        }
      }

      if (jumping) {
        verticalSpeed -= payload.lastFrameTime * 0.006;
        jumpY -= verticalSpeed * payload.lastFrameTime * 0.24;
        if (jumpY > 0) {
          jumpY = 0;
          if (state.player.walking) {
            player.fx.walk.play();
          }
          jumping = false;
        }
      }
      let score = state.hud.score;
      if (dying === -1) {
        const scoreFrameTime =
          payload.lastFrameTime * 0.0001 * floors.filter(floor => floor.type === 'binPar').length;
        if (sleeping) {
          score -= scoreFrameTime * (state.hud.levels.alcohol + state.hud.levels.sleep) * 10;
        } else {
          score +=
            scoreFrameTime *
            ((10 - state.hud.levels.sleep) * 5 -
              state.hud.levels.alcohol * 2 -
              state.hud.levels.bile * 8);
        }
      }
      return {
        ...state,
        night,
        lightTint,
        timeSpeed,
        level: newLevel,
        elevator,
        hud: {
          ...state.hud,
          time: {
            h: Math.floor(totalMins / 60) % 24,
            m: totalMins % 60,
          },
          levels: {
            ...state.hud.levels,
            alcohol: Math.max(state.hud.levels.alcohol - time2PerH, 0),
            sleep: state.player.sleeping
              ? Math.max(state.hud.levels.sleep - time15PerH, 0)
              : Math.min(state.hud.levels.sleep + time06PerH, 10),
            bile: Math.max(
              Math.min(
                state.hud.levels.bile +
                  state.player.programmersFailing * time03PerH -
                  state.player.playing * time2PerH,
                10,
              ),
              0,
            ),
          },
          score,
        },
        player: {
          ...state.player,
          floor: playerFloor,
          x: playerX,
          verticalSpeed,
          jumpY,
          jumping,
          sleeping,
          walking,
          alarm,
          inBed,
          sleepStart,
          stunned,
          dying,
          exploded,
        },
        floors,
        totalTime,
        lastFrameTime: payload.lastFrameTime,
      };
    }
    default:
      return state;
  }
};

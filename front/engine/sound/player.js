/* eslint-env browser */
import { Howl } from 'howler';

let lib = {};

if (process.browser) {
  if (!window.soundLib) {
    lib.bg = {};

    lib.bg.menu = new Howl({
      src: ['/static/sound/menu.mp3'],
      loop: true,
      volume: 0.2,
    });
    lib.bg.menu.baseVolume = 0.5;

    lib.bg.stage = new Howl({
      src: ['/static/sound/stage.wav'],
      loop: true,
    });
    lib.bg.stage.baseVolume = 0.06;

    lib.bg.sleeping = new Howl({
      src: ['/static/sound/sleeping.wav'],
      loop: true,
    });
    lib.bg.sleeping.baseVolume = 0.7;

    lib.bg.playing = new Howl({
      src: ['/static/sound/playing.wav'],
      loop: true,
    });
    lib.bg.playing.baseVolume = 0.7;

    lib.bg.gameOver = new Howl({
      src: ['/static/sound/gameOver.mp3'],
    });
    lib.bg.gameOver.baseVolume = 0.5;

    lib.fx = {};
    lib.fx.jump = new Howl({
      src: ['/static/sound/jump.wav'],
    });

    lib.fx.redBull = new Howl({
      src: ['/static/sound/redBull.wav'],
      volume: 0.6,
    });

    lib.fx.gin = new Howl({
      src: ['/static/sound/gin.wav'],
    });

    lib.fx.elevatorDoor = new Howl({
      src: ['/static/sound/elevatordoor.wav'],
    });

    lib.fx.elevator = new Howl({
      src: ['/static/sound/elevator.wav'],
    });
    lib.fx.start = new Howl({
      src: ['/static/sound/start.wav'],
    });
    lib.fx.walk = new Howl({
      src: ['/static/sound/walk.wav'],
      loop: true,
    });
    lib.fx.alarm = new Howl({
      src: ['/static/sound/alarm.wav'],
      loop: true,
    });
    lib.fx.wakeOK = new Howl({
      src: ['/static/sound/wakeOK.wav'],
    });
    lib.fx.wakeKO = new Howl({
      src: ['/static/sound/wakeKO.wav'],
    });
    lib.fx.drop = new Howl({
      src: ['/static/sound/drop.mp3'],
    });
    lib.fx.refill = new Howl({
      src: ['/static/sound/refill.wav'],
    });
    lib.fx.fill = new Howl({
      src: ['/static/sound/fill.wav'],
    });
    lib.fx.newFloor = new Howl({
      src: ['/static/sound/newFloor.wav'],
    });
    lib.fx.barLights = new Howl({
      src: ['/static/sound/barLights.wav'],
    });
    lib.fx.officeLights = new Howl({
      src: ['/static/sound/officeLights.wav'],
    });
    lib.fx.typing = new Howl({
      src: ['/static/sound/typing.wav'],
      loop: true,
    });
    lib.fx.newError = new Howl({
      src: ['/static/sound/newError.wav'],
    });
    lib.fx.errorFixed = new Howl({
      src: ['/static/sound/errorFixed.wav'],
    });
    lib.fx.comercial = new Howl({
      src: ['/static/sound/comercial.wav'],
    });
    lib.fx.yawn = new Howl({
      src: ['/static/sound/yawn.wav'],
    });
    lib.fx.flirt = new Howl({
      src: ['/static/sound/flirt.wav'],
    });
    lib.fx.explosion = new Howl({
      src: ['/static/sound/explosion.wav'],
    });
    lib.fx.coffee = new Howl({
      src: ['/static/sound/coffee.wav'],
    });

    lib.fx.walk.baseVolume = 0.4;
    window.soundLib = lib;

    Object.keys(lib.bg).forEach((sndName) => {
      const snd = lib.bg[sndName];
      snd.play();
      snd.volume(0);
    });
  } else {
    lib = window.soundLib;
  }
}

let lastMusicSet = '';

lib.setBackgroundMusic = (musicToSet) => {
  if (process.browser) {
    Object.keys(lib.bg).forEach((sndName) => {
      const snd = lib.bg[sndName];
      snd.fade(
        lastMusicSet === sndName ? snd.baseVolume : 0,
        sndName === musicToSet ? snd.baseVolume : 0,
        1000,
      );
    });
  }
  lastMusicSet = musicToSet;
};

export default { ...lib };

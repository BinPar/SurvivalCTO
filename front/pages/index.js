import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import player from '../engine/sound/player';

const play = (e) => {
  e.preventDefault();
  const startSound = player.fx.start.play();
  player.setBackgroundMusic('');
  player.fx.start.on('end', () => Router.push('/play'), startSound);
  return false;
};
export default () => {
  player.setBackgroundMusic('menu');
  return (
    <div>
      <Head>
        <title>CTO Survival</title>
        <link rel="stylesheet" type="text/css" href="/static/main.css" />
        <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet" />
      </Head>
      <div className="startBox">
        <h1>CTO Survival</h1>
        <p className="copy">&copy; Magonand 2017</p>
        <p>V 1.1</p>
        <p className="blink">Insert coin</p>
        <p>
          <a href="/play" onClick={play}>
            Press Start for 1P
          </a>
        </p>
      </div>
    </div>
  );
};

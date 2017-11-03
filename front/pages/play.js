import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const GameEngine = dynamic(import('../engine/ui/game'), {
  ssr: false,
});

export default () => {
  return (
    <div>
      <Head>
        <title>CTO Survival</title>
        <link rel="stylesheet" type="text/css" href="/static/main.css" />
        <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet" />
      </Head>
      <GameEngine />
    </div>
  );
};

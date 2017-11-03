/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import { connect } from 'react-redux';
import React from 'react';

const hud = props => (
  <div className="hud">
    <div className="watch">
      {`${props.time.h > 9 ? '' : '0'}${props.time.h} ${props.time.m > 9 ? '' : '0'}${props.time.m}`
        .split('')
        .map((char, num) => <span key={num}>{char}</span>)}
    </div>
    <div className="watch">:</div>
    <span className="level">{props.level}</span>
    <div className="levels sleep">
      <span style={{ width: `${props.levels.sleep * 10}%` }} />
    </div>
    <div className="levels bile">
      <span style={{ width: `${props.levels.bile * 10}%` }} />
    </div>
    <div className="levels alcohol">
      <span style={{ width: `${props.levels.alcohol * 10}%` }} />
    </div>
  </div>
);
export default connect(store => ({ ...store.hud, level: store.level }))(hud);

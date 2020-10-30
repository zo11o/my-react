import React, { useState } from 'react';
import Player from './views/player';

import { coolPlayerTypes } from '../index';
import classnames from 'classnames';

function App() {
  const [data, setData] = useState([
    {
      src: 'http://neroht.com/%E9%95%9C%E4%BA%88%E6%AD%8C%20-%20%E8%A5%BF%E5%B7%B7%E6%A1%A5%E8%BE%B9.mp3',
      artist: '瑾姝',
      name: '西巷桥边',
      img: 'http://neroht.com/109951164352276322.jpg',
      id: '66575568141',
    },
    {
      src: 'http://neroht.com/Take%20Your%20Time%20%20-%20alexandr.mp3',
      artist: 'Alexandr',
      name: 'Take Your Time',
      img: 'http://neroht.com/alexander.png',
      id: '66575568446',
      disabled: true,
    },
  ]);

  const [playing, setPlaying] = useState<boolean>(false);

  return (
    <div className="App">
      <Player
        data={data}
        showLyricNormal={true}
        onPlayStatusChange={(currentAudio: coolPlayerTypes.IAudio, isPlayed: boolean) => {
          setPlaying(isPlayed);
        }}
      ></Player>
    </div>
  );
}

export default App;

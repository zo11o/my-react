import React, { useState } from 'react';
import Player from './views/player';

import { coolPlayerTypes } from '../index';
import classnames from 'classnames';
import './index.scss';

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
      src:
        'http://neroht.com/%E7%91%BE%E5%A7%9DHikari%20-%20%E8%B5%A4%E4%BC%B6%EF%BC%88Cover%EF%BC%9AHITA%EF%BC%89.mp3',
      artist: '瑾姝Hikari',
      name: '赤伶',
      img: 'http://neroht.com/chiling.jpg',
      id: '66575568443',
    },
    {
      src: 'http://neroht.com/Shayne Ward - Breathless.mp3',
      artist: 'Shayne Ward',
      name: 'Breathless',
      img: 'http://neroht.com/shayneWard.jpg',
      id: '66575568425467865',
      lyric:
        "[by:青烟x]\n[ti:Breathless]\n[ar:Shayne Ward]\n[al:Breathless]\n[by:青烟]\n[00:00.000] 作词 : BIRGISSON, ARNTHOR/KOTECHA, SAVAN/YACOUB, RAMI\n[00:09.00]If our love was a fairy tale\n[00:13.04]I would charge in and rescue you\n[00:16.95]On a yacht baby we would sail\n[00:20.77]To an island where we'd say I do\n[00:24.52]And if we had babies they would look like you\n[00:28.44]It'd be so beautiful if that came true\n[00:32.34]You don't even know how very special you are\n[00:36.66]Chorus\n[00:37.96]You leave me breathless\n[00:42.55]You're everything good in my life\n[00:45.55]You leave me breathless\n[00:50.20]I still can't believe that you're mine\n[00:53.74]You just walked out of one of my dreams\n[00:57.83]So beautiful you're leaving me\n[01:02.11]Breathless\n[01:07.00]And if our love was a story book\n[01:11.15]We would meet on the very first page\n[01:15.01]The last chapter would be about\n[01:18.45]How I'm thankful for the life we've made\n[01:22.61]And if we had babies they would have your eyes\n[01:26.66]I would fall deeper watching you give life\n[01:30.46]You don't even know how very special you are\n[01:35.90]You leave me breathless\n[01:40.88]You're everything good in my life\n[01:43.89]You leave me breathless\n[01:48.46]I still can't believe that you're mine\n[01:51.69]You just walked out of one of my dreams\n[01:55.87]So beautiful you're leaving me\n[02:00.32]You must have been sent from heaven to earth to change me\n[02:06.38]You're like an angel\n[02:08.42]The thing that I feel is stronger than love believe me\n[02:13.84]You're something special\n[02:16.03]I only hope that I'll one day deserve what you've given me\n[02:21.49]But all I can do is try\n[02:26.00]Every day of my life\n[02:33.86]You leave me breathless\n[02:38.66]You're everything good in my life\n[02:41.93]You leave me breathless\n[02:46.47]I still can't believe that you're mine\n[02:49.78]You just walked out of one of my dreams\n[02:53.99]So beautiful you're leaving me\n[02:58.21]Breathless\n[03:02.19]You're everything good in my life\n[03:05.23]You leave me breathless\n[03:09.72]I still can't believe that you're mine\n[03:12.96]You just walked out of one of my dreams\n[03:17.44]So beautiful you're leaving me\n[03:21.37]Breathless\n",
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

  const [noActionsShow, setNoActionsShow] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [playListShow, setPlayListShow] = useState<boolean>(false);
  const noActions = () => {
    setNoActionsShow(true);
    setTimeout(() => {
      setNoActionsShow(false);
    }, 2000);
  };

  const actions = [
    (music: any) => {
      return (
        <div style={{ fontSize: 22, marginRight: 8 }} key={'a'} onClick={noActions}>
          <svg
            className="icon"
            style={{
              width: '1em',
              height: '1em',
              verticalAlign: 'middle',
              fill: 'currentColor',
              overflow: 'hidden',
              color: '#868686',
            }}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1279"
          >
            <path
              d="M892.7 896.1H131.3c-18.4 0-33.3-14.9-33.3-33.3V696.4c0-18.4 14.9-33.3 33.3-33.3h30c18.4 0 33.3 14.9 33.3 33.3 0 4.5-0.9 8.9-2.6 12.8l-13 64.9c0 18.4 14.9 33.3 33.3 33.3h599.3c18.4 0 33.3-14.9 33.3-33.3l-13-64.9c-1.7-4-2.6-8.3-2.6-12.8 0-18.4 14.9-33.3 33.3-33.3h30c18.4 0 33.3 14.9 33.3 33.3v166.5c0.1 18.3-14.8 33.2-33.2 33.2zM580 582h1l-1 0.9v-0.9z m247.2-228.6l1.6 0.1-234.7 216.4v-2.3h-0.1c-0.3 3.7-3.4 6.7-7.2 6.7-4 0-7.2-3.2-7.2-7.2 0-0.7 0.1-1.3 0.3-1.9V433.3c-11.4-0.7-23-1.1-34.7-1.1-134.7 0-247.2 95.2-273.7 222.1-12.1-18.3-17.1-49.1-17.1-100 0-154.5 125.2-294.1 279.7-294.1 15.8 0 31.1 0.1 45.8 0.4V136.1c-0.2-0.6-0.3-1.2-0.3-1.9 0-4 3.2-7.2 7.2-7.2 3.8 0 6.9 2.9 7.2 6.7h0.1v-1.8L829.6 339h-2.4v0.1c3.7 0.3 6.7 3.4 6.7 7.2 0 3.7-3 6.8-6.7 7.1z"
              fill=""
              p-id="1280"
            ></path>
          </svg>
        </div>
      );
    },
    (music: any) => {
      return (
        <div style={{ fontSize: 22 }} key={'b'} onClick={noActions}>
          <svg
            className="icon"
            style={{
              width: '1em',
              height: '1em',
              verticalAlign: 'middle',
              fill: 'currentColor',
              overflow: 'hidden',
              color: '#868686',
            }}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3936"
          >
            <path
              d="M711.713554 104.804974c-77.222779 0-151.3388 35.948747-199.713554 92.53451-48.374754-56.585763-122.490775-92.53451-199.713554-92.53451-136.915299 0-244.094344 107.180068-244.094344 244.094344 0 167.537737 150.894685 304.453037 379.456265 511.933485l64.352657 58.361199 64.352657-58.361199C804.913213 653.353378 955.808922 516.438079 955.808922 348.900342 955.808922 211.985042 848.628854 104.804974 711.713554 104.804974zM516.660136 795.149848l-4.660136 4.216022-4.660136-4.216022C296.308543 603.64628 156.952658 477.160517 156.952658 348.900342c0-88.539522 66.793242-155.332764 155.332764-155.332764 68.346621 0 134.917806 44.158732 158.217465 104.738459l82.770122 0c23.521716-60.579727 90.092901-104.738459 158.439522-104.738459 88.539522 0 155.332764 66.793242 155.332764 155.332764C867.046319 477.160517 727.690434 603.64628 516.660136 795.149848z"
              p-id="3937"
            ></path>
          </svg>
        </div>
      );
    },
  ];

  const onPlayListHide = () => {
    setPlayListShow(false);
  };

  return (
    <div className="App">
      <div className="player-wrap">
        <Player
          data={data}
          showLyricNormal={true}
          actions={actions}
          onPlayStatusChange={(currentAudio: coolPlayerTypes.IAudio, isPlayed: boolean) => {
            setPlaying(isPlayed);
          }}
          play={playing}
          playDetailShow={false}
          playListShow={playListShow}
          onPlayListStatusChange={(status: boolean) => {
            setPlayListShow(status);
          }}
          playListHeader={{
            headerLeft: 'Play List',
            headerRight: (
              <span onClick={onPlayListHide} className={'close-play-list'}>
                Close
              </span>
            ),
          }}
          showLyricMini={true}
        ></Player>
      </div>
    </div>
  );
}

export default App;

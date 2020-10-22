import React from 'react';
import './index.scss';
import classnames from 'classnames';
import { coolPlayerTypes } from '../../../index';
import {
  IconPlaylistPlaying,
  IconPlaylistPlay,
  IconPlay,
  IconPause,
  IconPrev,
  IconNext,
  IconMenu,
  IconModeOrder,
  IconModeRandom,
  IconModeLoop,
  IconVolume,
  IconMute,
  IconDetailHide,
  IconDelete,
} from './icons';
const { useState, useRef, useEffect } = React;

enum PlayMode {
  Order = 'order',
  Random = 'random',
  Loop = 'loop',
}
type PlayModeTypes = 'order' | 'random' | 'loop';

const Player = (props: coolPlayerTypes.IPlayerProps) => {
  const { data, currentAudio } = props;

  const initialMusic = {
    src: '',
    artist: '',
    name: '',
    img: '',
    id: '',
    lyric: '',
    invalid: true,
  };

  const coolPlayerEl = useRef(null);
  const coolPlayerInnerEL = useRef(null);
  const playControlEl = useRef(null);
  const musicBoxEl = useRef(null);
  const avatarEl = useRef(null);
  const musicAvatarEl = useRef(null);
  const bufferedEl = useRef(null);
  const playedEl = useRef(null);
  const actionsEl = useRef(null);
  const volumeProgressEl = useRef(null);
  // 播放器
  const audioEl = useRef(null);
  const insideCircleEl = useRef(null);
  const totalVolumeEl = useRef(null);

  // 是否暂停
  const [isPaused, setPause] = useState<boolean>(true);
  const [currentMusic, setCurrentMusic] = useState<coolPlayerTypes.IAudio>(
    currentAudio || (data && data[0]) || initialMusic
  );
  // 计算剩余时间
  const [remainTime, setRemainTime] = useState<number | string>('00:00');
  // 总时间
  const [totalTime, setTotalTime] = useState<number | string>('00:00');
  // 设置播放模式
  const [mode, setMode] = useState<PlayModeTypes>(PlayMode.Order);
  // 是否静音
  const [isMute, setIsMute] = useState<boolean>(false);
  const {
    icons = {},
    actions = [],
    showLyricMini = false,
    primaryColor = '#33beff',
    avatarPlaceholder = <div className={'cool-player-avatar-placeholder'}></div>,
  } = props;

  const {
    playListIcon = IconMenu,
    playListPlay = IconPlaylistPlay,
    playListPlaying = IconPlaylistPlaying,
    deleteIcon = IconDelete,
    playIcon = IconPlay,
    pauseIcon = IconPause,
    prevIcon = IconPrev,
    nextIcon = IconNext,
    modeOrder = IconModeOrder,
    modeRandom = IconModeRandom,
    modeLoop = IconModeLoop,
    volumeIcon = IconVolume,
    muteIcon = IconMute,
    detailHide = IconDetailHide,
  } = icons;

  /**
   * 下一首歌
   */
  const last = () => {};

  /**
   * 暂停
   */
  const pause = () => {};

  /**
   * 下一首
   */
  const next = () => {};

  /**
   * 播放
   */
  const play = () => {};

  const onSwitchPlayMode = () => {
    const singleCycle = <div>{modeLoop}</div>;
    const playInOrder = <div>{modeOrder}</div>;
    const playInRandom = <div>{modeRandom}</div>;
    switch (mode) {
      case PlayMode.Order:
        return playInOrder;
      case PlayMode.Random:
        return playInRandom;
      case PlayMode.Loop:
        return singleCycle;
      default:
        break;
    }
  };

  return (
    <div id={'cool-player'} ref={coolPlayerEl}>
      <div className="cool-player-wrapper">
        <div className="cool-player-inner" ref={coolPlayerInnerEL}>
          <div className="cool-player-control" ref={playControlEl}>
            <div className="cool-player-control-btn">
              <div className="icon-prev" onClick={() => last()} data-test={'prev-btn'}>
                {prevIcon}
              </div>
              {!isPaused && currentMusic && currentMusic.src ? (
                <div className="icon-pause" onClick={pause} data-test={'play-btn'}>
                  {pauseIcon}
                </div>
              ) : (
                <div className="icon-play" onClick={play} data-test={'play-btn'}>
                  {playIcon}
                </div>
              )}
              <div className="icon-next" onClick={next} data-test={'next-btn'}>
                {nextIcon}
              </div>
            </div>
          </div>
          <div className="cool-player-box" ref={musicBoxEl}>
            <div
              className={classnames('picture-wrapper', {
                'picture-wrapper-large': !isPaused,
              })}
            >
              <div className="picture" onClick={() => {}} data-test={'detail-show'}>
                <svg xmlns="http://www.w3.org/200/svg" height="64" width="64" className="circle-progress">
                  <circle
                    className={'outside-circle'}
                    cx="31"
                    cy="33"
                    r="27"
                    fill="none"
                    stroke="#e4e4e4"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  {currentMusic && (
                    <circle
                      className={'inside-circle'}
                      ref={insideCircleEl}
                      id="J_progress_bar"
                      cx="31"
                      cy="31"
                      r="26"
                      fill="none"
                      stroke={primaryColor}
                      strokeWidth="5"
                    />
                  )}
                </svg>
                {currentMusic && currentMusic.src ? (
                  <div className="avatar" ref={avatarEl}>
                    <img alt={'头像'} src={currentMusic.img} ref={musicAvatarEl}></img>
                  </div>
                ) : (
                  avatarPlaceholder
                )}
              </div>
            </div>
            <div className="cool-player-audio-info">
              <div
                className="cool-player-audio-name"
                data-test="music-name"
                title={currentMusic && currentMusic.src && `${currentMusic.name}`}
              >
                {currentMusic && currentMusic.src && `${currentMusic.name}`}
              </div>
              <div className="progress-wrapper">
                <div className="progress">
                  <div className="progress-buffered" ref={bufferedEl}></div>
                  <div className="progress-played" ref={playedEl} style={{ background: primaryColor }}>
                    <div className="progress-action-point"></div>
                  </div>
                </div>
              </div>
              <div className="time">
                <div className="remain-time">{currentMusic && currentMusic.src ? remainTime : '00.00'}</div>
                <span>/</span>
                <div className="total-time">{currentMusic && currentMusic.src ? totalTime : '00:00'}</div>
              </div>
              {showLyricMini && (
                <div className="cool-lyric-mini-wrapper">
                  {/* TODO: 小歌词 */}
                  <span>小歌词</span>
                </div>
              )}
            </div>
            <div className="cool-player-list-mode-btn">
              <div className="icon-menu">{playListIcon}</div>
              <div className="cool-player-mode">
                <div className="mode">{onSwitchPlayMode()}</div>
              </div>
            </div>
          </div>
          {actions.length && (
            <div className="cool-player-actions" ref={actionsEl}>
              {actions.map((item) => item(currentMusic))}
            </div>
          )}

          <div className="right-control">
            {
              // 静音
              isMute ? (
                <div className={'icon-mute'} onClick={() => {}}>
                  {volumeIcon}
                </div>
              ) : (
                <div className={'icon-volume'}>{muteIcon}</div>
              )
            }
            <div className="volume-control-wrapper">
              <div className="volume-control" ref={totalVolumeEl}>
                <div className="volume-progress" ref={volumeProgressEl} style={{ background: primaryColor }}>
                  <div className="volume-progress-dot"></div>
                </div>
              </div>
            </div>
          </div>
          <audio src={currentMusic && currentMusic.src ? currentMusic.src : ''} ref={audioEl} />
        </div>
      </div>
    </div>
  );
};

export default Player;

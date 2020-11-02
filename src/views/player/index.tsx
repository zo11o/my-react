import React from 'react';
import './index.scss';
import classnames from 'classnames';
import { coolPlayerTypes } from '../../../index';
import { getTime } from '../../utils/index';
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

let rotateTimer: NodeJS.Timeout;
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
  const musicAvatarEl = useRef<HTMLImageElement>(null);
  const bufferedEl = useRef<HTMLDivElement>(null);
  const playedEl = useRef<HTMLDivElement>(null);
  const actionsEl = useRef(null);
  const volumeProgressEl = useRef<HTMLDivElement>(null);
  // 播放器
  const audioEl = useRef<HTMLAudioElement>(null);
  const insideCircleEl = useRef(null);
  const totalVolumeEl = useRef<HTMLDivElement>(null);

  // 是否暂停
  const [isPaused, setPause] = useState<boolean>(true);
  // 是否播放中
  const [isPlayed, setIsPlayed] = useState<boolean>(false);
  const [currentMusic, setCurrentMusic] = useState<coolPlayerTypes.IAudio>(
    currentAudio || (data && data[0]) || initialMusic
  );
  // 计算已使用时间
  const [remainTime, setRemainTime] = useState<number | string>('00:00');
  // 总时间
  const [totalTime, setTotalTime] = useState<number | string>('00:00');
  // 设置播放模式
  const [mode, setMode] = useState<PlayModeTypes>(PlayMode.Order);
  // 是否静音
  const [isMute, setIsMute] = useState<boolean>(false);
  // 设置音量
  const [volumeValue, setVolumeValue] = useState<number>(0);
  // 进度条进度
  const [playedLeft, setPlayedLeft] = useState<number>(0);
  const [playedWidth, setPlayedWidth] = useState<number>(0);
  const [volumeLeft, setVolumeLeft] = useState<number>(0);
  const [playPercent, setPlayPercent] = useState<number>(0);
  const [bufferedWidth, setBufferedWidth] = useState<number>(0);
  // 旋转角度
  const [angle, setAngle] = useState<number>(0);

  const {
    icons = {},
    actions = [],
    showLyricMini = false,
    showLyricNormal = false,
    volume = 0.5,
    onPlayStatusChange,
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

  // 首次加载执行
  useEffect(() => {
    console.log('首次加载执行');
    let audio = audioEl.current;
    if (!audio) {
      return;
    }
    audio.addEventListener('canplay', setInitialTotalTime);
    audio.volume = volume;

    let volumeProgress = volumeProgressEl.current;
    if (volumeProgress) {
      volumeProgress.style.width = '50%';
    }
    setVolumeValue(volume);
    return () => {
      audioEl.current?.removeEventListener('canplay', setInitialTotalTime);
      audioEl.current?.removeEventListener('timeupdate', setProgress);
    };
  }, []);

  /**
   * 暂停、播放更新状态
   */
  useEffect(() => {
    const audio = audioEl.current;
    if (!isPaused) {
      audio?.play();
    } else {
      audio?.pause();
    }
    audio?.addEventListener('timeupdate', setProgress);

    return () => {
      audio?.removeEventListener('timeupdate', setProgress);
    };
  }, [isPaused, currentMusic, mode]);

  useEffect(() => {
    if (!isPaused) {
      clearTimeout(rotateTimer);
      if (!currentMusic || (currentMusic && currentMusic.disabled)) {
        return;
      }
      rotate();
    }

    return () => {
      clearTimeout(rotateTimer);
    };
  }, [angle, isPaused, currentMusic]);

  // 头像旋转
  const rotate = () => {
    rotateTimer = setTimeout(() => {
      rotate();
      setAngle(angle + 1);
      if (musicAvatarEl.current) {
        musicAvatarEl.current.style.transform = `rotate(${angle}deg)`;
      }
    }, 25);
  };

  /**
   * 下一首歌
   */
  const last = () => {};

  /**
   * 暂停
   */
  const pause = () => {
    setPause(true);
    if (onPlayStatusChange) {
      onPlayStatusChange(currentMusic, false);
    }
  };

  /**
   * 下一首
   */
  const next = () => {};

  /**
   * 随机播放
   */
  const random = () => {};

  /**
   * 播放
   */
  const play = () => {
    // console.log('播放')
    if (!currentMusic || currentMusic.invalid || currentMusic.disabled) {
      return;
    }
    setPause(false);
    setIsPlayed(true);

    // 判断是否没有数据
    if (checkNoData()) {
      return;
    }

    if (onPlayStatusChange) {
      onPlayStatusChange(currentMusic, true);
    }
  };

  const checkNoData = () => !currentAudio && !currentMusic && !data?.length;

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

  /**
   * 计算总时长
   */
  const setInitialTotalTime = () => {
    // 获取总时间
    let audio = audioEl.current;
    if (!audio) {
      return;
    }
    const musicTotalTime = parseInt(String(audio.duration), 0);
    // 计算总时间
    setTotalTime(getTime(musicTotalTime));
    // 计算已使用时间
    setRemainTime(getTime(0));
    if (playedEl.current) {
      setPlayedLeft(playedEl.current.getBoundingClientRect().left);
    }
    console.log(totalVolumeEl.current);
    if (totalVolumeEl.current) {
      setVolumeLeft(totalVolumeEl.current.getBoundingClientRect().left);
    }
  };

  const setProgress = () => {
    if (!audioEl.current) {
      return;
    }
    // 设置播放进度条
    let playPer = audioEl.current?.currentTime / audioEl.current?.duration;
    const { duration } = audioEl.current;
    // 判断 NaN !== NaN
    if (isNaN(duration)) {
      playPer = 0;
    }
    setPlayPercent(playPer);
    if (playedEl.current) {
      playedEl.current.style.width = playPer * 100 + '%';
    }
    setPlayedWidth(playPer * 100);
    // TODO: 详情

    // 设置缓冲进度条
    const timeRages = audioEl.current.buffered;
    let bufferedTime = 0;
    if (timeRages.length !== 0) {
      bufferedTime = timeRages.end(timeRages.length - 1);
      console.log(bufferedTime);
    }
    const bufferedPer = bufferedTime / audioEl.current.duration;

    bufferedEl.current && (bufferedEl.current.style.width = bufferedPer * 100 + '%');
    setBufferedWidth(bufferedPer * 100);
    // 设置剩余时间
    const musicRemainTime = parseInt(`${audioEl.current.currentTime}`, 0);
    setTimeout(() => {
      setRemainTime(getTime(musicRemainTime));
    });

    // 歌曲播放结束
    if (audioEl.current.ended) {
      clearTimeout(rotateTimer);
      setPlayPercent(0);
      playedEl.current && (playedEl.current.style.width = '0%');
      setPlayedWidth(0);
      // TODO: 详情
      pause();
      if (mode === PlayMode.Order) {
        next();
        play();
      } else if (mode === PlayMode.Random) {
        random();
      } else if (mode === PlayMode.Loop) {
        const currentMusicAgain = JSON.parse(JSON.stringify(currentMusic));
        setCurrentMusic(currentMusicAgain);
        play();
      }
      setAngle(0);
    }
  };

  return (
    <div id={'cool-player'} ref={coolPlayerEl}>
      <div className="cool-player-wrapper">
        <div className="cool-player-inner" ref={coolPlayerInnerEL}>
          <div className="cool-player-control" ref={playControlEl}>
            <div className="cool-player-control-btn">
              <div className="icon-prev" onClick={last} data-test={'prev-btn'}>
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

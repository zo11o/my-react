import React from 'react';
import './index.scss';
import classnames from 'classnames';
import { coolPlayerTypes } from '../../../index';
import { fixedBody, looseBody, getTime, getLyric } from '../../utils/index';
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
import LyricMini from '../../components/lyricMini';
const { useState, useRef, useEffect } = React;
const CSSTransitionGroup = require('react-addons-css-transition-group');

let rotateTimer: NodeJS.Timeout;
enum PlayMode {
  Order = 'order',
  Random = 'random',
  Loop = 'loop',
}
type PlayModeTypes = 'order' | 'random' | 'loop';
const Player = (props: coolPlayerTypes.IPlayerProps) => {
  const { data = [], currentAudio } = props;

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
  const detailPlayedEl = useRef(null);
  const musicAvatarEl = useRef<HTMLImageElement>(null);
  const bufferedEl = useRef<HTMLDivElement>(null);
  const playedEl = useRef<HTMLDivElement>(null);
  const actionsEl = useRef(null);
  const volumeProgressEl = useRef<HTMLDivElement>(null);
  const progressEl = useRef<HTMLDivElement>(null);
  // 播放器
  const audioEl = useRef<HTMLAudioElement>(null);
  const insideCircleEl = useRef<SVGCircleElement>(null);
  const totalVolumeEl = useRef<HTMLDivElement>(null);
  const coolPlayListWrapper = useRef<HTMLDivElement>(null);
  // 歌曲详情
  const playListEl = useRef<HTMLDivElement>(null);

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
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  // 旋转角度
  const [angle, setAngle] = useState<number>(0);
  const [musicListShow, setMusicListShow] = useState<boolean>(false);

  const [lyric, setLyric] = useState<coolPlayerTypes.ILyric[]>([]);
  const [lyricIndex, setLyricIndex] = useState<number>(-1);

  const {
    icons = {},
    actions = [],
    showLyricMini = false,
    showLyricNormal = false,
    volume = 0.5,
    lyric: lyricFromProps = '',
    onPlayStatusChange,
    primaryColor = '#33beff',
    avatarPlaceholder = <div className={'cool-player-avatar-placeholder'}></div>,
    play: beginPlay,
    onVolumeChange,
    playDetailShow = false,
    onPlayDetailStatusChange,
    onPlayListStatusChange,
    onAudioChange,
    playListPlaceholder = 'No Data',
    playListHeader = {
      headerLeft: 'Play List',
      headerRight: '',
    },
    playListAudioActions = [],
    playListShow = false,
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

  let lyricList: coolPlayerTypes.ILyric[] = getLyric((currentMusic && currentMusic.lyric) || lyricFromProps);
  let indexArr: number[] = [];

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
   * 设置是否立即播放
   */
  useEffect(() => {
    if (beginPlay) {
      play();
    } else {
      pause();
    }
  }, [beginPlay]);

  useEffect(() => {
    console.log(22);
    setMusicListShow(playListShow);
  }, [playListShow]);

  /**
   * 控制模态框zIndex
   */
  useEffect(() => {
    const { zIndex = 1000 } = props;
  }, [musicListShow]);

  /**
   * 播放详情
   */
  useEffect(() => {
    if (playDetailShow) {
      onShowDetail();
    } else {
      onHideDetail();
    }
  }, [playDetailShow]);

  useEffect(() => {
    console.log('currentMusic');
    if (currentMusic) {
      if (insideCircleEl.current) {
        insideCircleEl.current.setAttribute('stroke-dasharray', '0,10000');
      }
    }

    if (props.onAudioChange && currentMusic) {
      props.onAudioChange(currentMusic.id, currentMusic);
    }

    setLyricIndex(-1);
    setLyric([]);
    setAngle(0);
  }, [currentMusic]);

  /**
   * 清除缓冲条
   */
  useEffect(() => {
    if (playedEl.current) {
      playedEl.current.style.width = '0%';
    }
    if (bufferedEl.current) {
      bufferedEl.current.style.width = '0%';
    }
  }, [currentMusic]);

  useEffect(() => {
    const audio = audioEl.current;
    lyricList = getLyric((currentMusic && currentMusic.lyric) || lyricFromProps);
    indexArr = [];
    setLyric(lyricList);
    audio?.addEventListener('timeupdate', setLyricHighLight);
    return () => {
      audioEl.current?.removeEventListener('timeupdate', setLyricHighLight);
    };
  }, [currentMusic, lyricFromProps]);

  /**
   * 设置当前歌曲
   */
  useEffect(() => {
    if (currentAudio) {
      setCurrentMusic(currentAudio);
    }
  }, [currentAudio]);

  useEffect(() => {
    console.log(document.body.clientWidth);
  }, [document.body.clientWidth]);

  /**
   * 设置音量
   */
  useEffect(() => {
    setVolume(0, volume);
  }, [volume]);

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

  const setLyricHighLight = () => {
    if (!audioEl.current) {
      return;
    }
    const current = audioEl.current.currentTime;
    if ((currentMusic && currentMusic.lyric) || lyricFromProps) {
      lyricList.forEach((item, index) => {
        if (item && lyricList[index - 1]) {
          if (current >= item.time) {
            indexArr.push(index);
          }
        }
      });
      setLyricIndex(indexArr[indexArr.length - 1]);
    }
  };

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

  const onToggleMute = () => {
    if (isMute) {
      setIsMute(false);
      audioEl.current && (audioEl.current.volume = volumeValue);
      onVolumeChange && onVolumeChange(volumeValue);
    } else {
      setIsMute(true);
      audioEl.current && (audioEl.current.volume = 0);
      onVolumeChange && onVolumeChange(0);
    }
  };

  const onShowDetail = () => {
    if (document.body.clientWidth > 600) {
      return;
    }
    fixedBody();
    setDetailVisible(true);
    if (onPlayDetailStatusChange) {
      onPlayDetailStatusChange(true);
    }
    setTimeout(() => {
      if (detailPlayedEl.current) {
        // setDetailPlayed()
      }
    });
  };

  const onHideDetail = () => {
    looseBody();
    setDetailVisible(false);
    if (onPlayDetailStatusChange) {
      onPlayDetailStatusChange(false);
    }
  };

  /**
   * 上一首歌
   */
  const last = (index?: number) => {
    if (checkNoData()) {
      return;
    }

    setAngle(0);
    // TODO:设置歌词
    // setLyricIndex(-1);

    if (!currentMusic || !currentMusic.src) {
      return;
    }

    let current;
    current = index || data.findIndex((item) => item.src === currentMusic.src);
    if (current > 0) {
      if (data[current - 1].disabled) {
        last(current - 1);
        return;
      }
      setCurrentMusic(data[current - 1]);
    } else {
      let prevIndex = data.length - 1;
      if (data[prevIndex].disabled) {
        last(prevIndex);
        return;
      }
      setCurrentMusic(data[prevIndex]);
    }
  };

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
  const next = (index?: number) => {
    console.log(index);
    if (checkNoData()) {
      return;
    }

    setAngle(0);
    // TODO: 设置歌词
    // setLyricIndex(-1);

    if (!currentMusic || !currentMusic.src) {
      return;
    }
    let current;
    current = index || data.findIndex((item) => item.id === currentMusic.id);
    if (current < data.length - 1) {
      if (data[current + 1].disabled) {
        next(current + 1);
        return;
      }
      setCurrentMusic(data[current + 1]);
    } else {
      if (data[0].disabled) {
        return;
      }
      setCurrentMusic(data[0]);
    }
  };

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

  const showMusicList = () => {
    setMusicListShow(!musicListShow);
    if (onPlayListStatusChange) {
      onPlayListStatusChange(!musicListShow);
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
      // console.log(bufferedTime);
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

  /**
   * 设置音量
   */
  const setVolume = (pageX: number, volumeValue?: number) => {
    const audio = audioEl.current;
    if (!audio || !totalVolumeEl.current) {
      return;
    }

    const volumeRate = volumeValue || (pageX - volumeLeft) / totalVolumeEl.current.offsetWidth;
    let currentVolume = volumeRate;
    if (volumeRate > 0.01 && volumeRate <= 1) {
      audio.volume = volumeRate;
      currentVolume = volumeRate;
      if (volumeProgressEl.current) {
        volumeProgressEl.current.style.width = volumeRate * 100 + '%';
      }
    } else if (volumeRate <= 0.01) {
      audio.volume = 0;
      currentVolume = 0;
      setIsMute(true);
    } else {
      audio.volume = 1;
      currentVolume = 1;
      setIsMute(false);
    }
    setVolumeValue(currentVolume);
    onVolumeChange && onVolumeChange(currentVolume);
  };

  const setTimeOnPc = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, action?: string) => {
    console.log(e);
    const audio = audioEl.current;
    if (!audio) {
      return;
    }
    if (audio.currentTime !== 0) {
      let targetPoint = 0;
      let newWidth = 0;
      if (action === 'touch' && detailVisible) {
        // TODO: 详情
      } else {
        if (progressEl.current) {
          targetPoint = e.pageX - playedLeft;
          newWidth = targetPoint / progressEl.current.offsetWidth;
        }
      }

      if (playedEl.current) {
        playedEl.current.style.width = newWidth * 100 + '%';
      }
      audio.currentTime = newWidth * audio?.duration;
      setLyricHighLight();
    }
  };

  const setTime = (e: React.TouchEvent<HTMLDivElement>, action?: string) => {
    const audio = audioEl.current;
    console.log(e);
    let targetPoint = e.touches[0].pageX - playedLeft;
  };

  /**
   * 移动端
   * @param e
   */
  const onTouchMoveProgress = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log(audioEl.current);
    if (audioEl.current?.currentTime !== 0) {
      setTime(e, 'touch');
    }
  };

  const clickChangeTime = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, action?: string) => {
    if (!e.pageX) {
      return;
    }
  };

  const slideChangeTime = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseDown) {
      setTimeOnPc(e);
    }
  };

  const clickChangeVolume = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setVolume(e.pageX);
  };

  const mouseDownVolume = () => {
    setMouseDown(true);
  };

  const slideChangeVolume = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseDown) {
      setVolume(e.pageX);
    }
  };

  const mouseUpVolume = () => {
    setMouseDown(false);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!e.pageX) {
      return;
    }
    setMouseDown(true);
    setTimeOnPc(e);
  };

  const onMouseUp = () => {
    setMouseDown(false);
  };

  const mouseLeave = () => {
    setMouseDown(false);
  };

  const playThis = (index?: number) => {};

  /**
   * TODO: 详情删除歌曲
   */
  const delMusic = (i: number, id: string) => {};

  const playMode = () => {};

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
              <div className="icon-next" onClick={() => next()} data-test={'next-btn'}>
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
              <div
                className="progress-wrapper"
                ref={progressEl}
                // onTouchMove={onTouchMoveProgress}
                // onTouchStart={onTouchTimeChangeStart}
                onClick={clickChangeTime}
                onMouseDown={onMouseDown}
                onMouseMove={slideChangeTime}
                onMouseUp={onMouseUp}
                onMouseLeave={mouseLeave}
              >
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
                  <LyricMini lyric={lyric || []} lyricIndex={lyricIndex} />
                </div>
              )}
            </div>
            <div className="cool-player-list-mode-btn">
              <div className="icon-menu" onClick={showMusicList}>
                {playListIcon}
              </div>
              <div className="cool-player-mode">
                <div className="mode" onClick={playMode}>
                  {onSwitchPlayMode()}
                </div>
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
                <div className={'icon-mute'} onClick={onToggleMute}>
                  {volumeIcon}
                </div>
              ) : (
                <div className={'icon-volume'} onClick={onToggleMute}>
                  {muteIcon}
                </div>
              )
            }
            <div
              className="volume-control-wrapper"
              onMouseDown={mouseDownVolume}
              onClick={clickChangeVolume}
              onMouseMove={slideChangeVolume}
              onMouseUp={mouseUpVolume}
              onMouseLeave={mouseLeave}
            >
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

      {/* 歌词详情Modal */}
      <div className="cool-player-list-wrapper" ref={coolPlayListWrapper}>
        <CSSTransitionGroup
          transitionName="cool-player-list-show"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {musicListShow ? (
            <div className="cool-player-list-lyric" ref={playListEl}>
              <div
                className={classnames('cool-player-list-component', {
                  'cool-player-list-component-half': showLyricNormal,
                })}
              >
                <div className="cool-player-list-title">
                  <div className="cool-player-list-title-left">{playListHeader.headerLeft}</div>
                  <div className="cool-player-list-title-left">{playListHeader.headerRight}</div>
                </div>
                {data && data.length ? (
                  <div className="cool-player-audio-wrapper">
                    {data.map((v, i) => {
                      return v.disabled ? (
                        <div className="cool-player-audio cool-player-audio-disabled" key={v.id}>
                          <div className={'cool-player-audio-left'}>
                            <div className="cool-player-audio-play">
                              <div className={'icon-play'}>{playListPlay}</div>
                            </div>
                            <div className="cool-player-audio-name" title={v.name}>
                              {v.name}
                            </div>
                          </div>
                          <div className={'cool-player-audio-right'}>
                            {v.disabled && v.disableReason && (
                              <div className={'cool-player-disabled-reason'}>{v.disableReason}</div>
                            )}
                            <div className="cool-player-audio-artist">{v.artist}</div>
                            <div className="cool-player-audio-del" onClick={() => delMusic(i, v.id)}>
                              {deleteIcon}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={'cool-player-audio'}
                          style={
                            currentMusic && currentMusic.src === v.src && isPlayed
                              ? { background: primaryColor, color: '#fff' }
                              : {}
                          }
                          key={v.id}
                        >
                          <div className={'cool-player-audio-left'}>
                            <div className="cool-player-audio-play">
                              {currentMusic && currentMusic.src === v.src && isPlayed ? (
                                <div className="icon-playing">{playListPlaying}</div>
                              ) : (
                                <div className="icon-play" onClick={() => playThis(i)}>
                                  {playListPlay}
                                </div>
                              )}
                            </div>
                            <div className="cool-player-audio-name" onClick={() => playThis(i)} title={v.name}>
                              {v.name}
                            </div>
                          </div>
                          <div className="cool-player-audio-right">
                            {playListAudioActions.length ? (
                              <div
                                className="cool-play-audio-actions"
                                onClick={() => {
                                  if (currentMusic.id !== v.id || !isPlayed) {
                                    playThis(i);
                                  }
                                }}
                              >
                                <div
                                  className={classnames('cool-player-audio-actions-content', {
                                    'cool-player-audio-actions-active':
                                      currentMusic && currentMusic.id === v.id && isPlayed,
                                  })}
                                >
                                  {playListAudioActions.map((item) =>
                                    item(v, (currentMusic && currentMusic.id === v.id) || false)
                                  )}
                                </div>
                              </div>
                            ) : null}
                            <div className="cool-player-audio-artist" onClick={() => playThis(i)}>
                              {v.artist}
                            </div>
                            <div
                              className="cool-player-audio-del"
                              onClick={() => delMusic(i, v.id)}
                              data-test={'icon-delete'}
                            >
                              {deleteIcon}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={'play-list-placeholder'}>{playListPlaceholder}</div>
                )}
              </div>
            </div>
          ) : null}
        </CSSTransitionGroup>

        {/* 全屏弹窗 */}
        <CSSTransitionGroup transitionName="cool-player-detail-show">{detailVisible && ''}</CSSTransitionGroup>
      </div>
    </div>
  );
};

export default Player;

import React from 'react'
import LyricMini from './src/components/lyricMini'

declare namespace coolPlayerTypes {
  interface IPlayerProps {
    /*播放列表的音频数据*/
    data?: IAudio[]
    /*需要播放的音频，可以控制当前播放器的音频，若不传入，播放器内待播放的音频默认为播放列表第一个音频*/
    currentAudio?: IAudio    /*是否开始播放*/
    play?: boolean
    /*音量*/
    volume?: number
    /*主题颜色*/
    primaryColor?: string
    /*移动端状态下是否展示迷你歌词*/
    showLyricMini?: boolean
    /*在非移动端状态下是否展示歌词*/
    showLyricNormal?: boolean
    /*非移动端状态下，展示在播放器内部的操作组，在播放模式按钮与音量控制按钮之间*/
    actions?: Array<(data: IAudio) => React.ReactNode>
    /*歌曲图片为空时歌曲图标的占位元素*/
    avatarPlaceholder?: React.ReactNode
    /*便于外部控制播放详情的显示与隐藏*/
    playDetailShow?: boolean
    playListShow?: boolean
    playListPlaceholder?: string
    // 异步加载歌词时，传入歌词数据
    lyric?: string
    zIndex?: number
    onAudioChange?: (id: string, currentMusic: IAudio) => void
    /*音量变化时的回调函数*/
    onVolumeChange?: (volume: number) => void
    /*切换播放和暂停触发的回调函数*/
    onPlayStatusChange?: (currentMusic: IAudio, isPlayed: boolean) => void
    onPlayDetailStatusChange?: (status: boolean) => void
    onPlayListStatusChange?:(status:boolean) => void
    playListHeader?: {
      headerLeft?: React.ReactNode | string,
      headerRight?: React.ReactNode | string
    }
    playListAudioActions?: Array<(data: IAudio, active?: boolean) => React.ReactNode>
    /*自定义图标*/
    icons?: {
      /*控制播放列表显示或隐藏的图标*/
      playListIcon?: React.ReactNode
      /*播放列表每个音频前面的播放按钮*/
      playListPlay?: React.ReactNode
      /*播放列表中每个音频正在播放的图标*/
      playListPlaying?: React.ReactNode
      /*播放列表中删除音频的删除图标*/
      deleteIcon?: React.ReactNode
      /*播放*/
      playIcon?: React.ReactNode
      /*暂停*/
      pauseIcon?: React.ReactNode
      /*上一首*/
      prevIcon?: React.ReactNode
      /*下一首*/
      nextIcon?: React.ReactNode
      /*顺序播放*/
      modeOrder?: React.ReactNode
      /*随机播放*/
      modeRandom?: React.ReactNode
      /*单曲循环*/
      modeLoop?: React.ReactNode
      /*音量*/
      volumeIcon?: React.ReactNode
      /*静音*/
      muteIcon?: React.ReactNode
      /*隐藏播放详情*/
      detailHide?: React.ReactNode,
    }
  }

  interface IAudio {
    /*音频链接*/
    src: string
    /*歌手*/
    artist: string
    /*音频名称*/
    name: string
    /*音频图片*/
    img: string
    /*唯一标识*/
    id: string
    /*歌词*/
    lyric?: string
    /*歌词翻译*/
    tLyric?: string
    /*是否不可用，组件内部的音频初始值会有这个值，表示当前无音频*/
    invalid?: boolean
    /*是否禁用*/
    disabled?: boolean
    /*禁用的原因*/
    disableReason?: string | React.ReactNode
  }

  interface ILyric {
    // 当前歌词时间
    time: number | string
    // 歌词文字
    lyric: string
  }

  interface ITLyric {
    [key: number]: string
    [key: string]: string
  }

  namespace lyricDetail {

  }

  namespace LyricMini {
    interface ILyricMiniProps {
      // 歌词
      lyric: ILyric[]
      // 与当前歌词播放时间匹配的歌词index
      lyricIndex: number
    }
  }

  namespace lyricNormal {
    
  }
}

export { coolPlayerTypes }

export default class CoolPlayer extends React.PureComponent<coolPlayerTypes.IPlayerProps, any>{ }
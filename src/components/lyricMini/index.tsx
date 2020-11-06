import React, { useState, useRef, useEffect } from 'react';
// import './index.less';
import { coolPlayerTypes } from '../../../index';

const LyricMini = (props: coolPlayerTypes.LyricMini.ILyricMiniProps) => {
  const { lyric, lyricIndex } = props;
  const [currentLyric, setCurrentLyric] = useState<string>('');
  const lyricEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(33);
    setCurrentLyric('');
    console.log(lyricEl);
    if (lyricEl.current) {
      lyricEl.current.style.marginTop = '-18';
      if (lyric.length && lyric[lyricIndex]) {
        setCurrentLyric(lyric[lyricIndex].lyric);
      }
    }
  }, [lyric, lyricIndex]);

  return (
    <div className={'cool-lyric-mini'}>
      <div ref={lyricEl} className={'cool-lyric-mini-content'}>
        {currentLyric}
      </div>
    </div>
  );
};

export default LyricMini;

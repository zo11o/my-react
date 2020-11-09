import React, { useEffect, useRef } from 'react';
import { coolPlayerTypes } from '../../../index';
import './index.scss';

const LyricNormal = (props: coolPlayerTypes.lyricNormal.ILyricNormalProps) => {
  const { lyric, tLyric = {}, lyricIndex, info, loading, lyricPlaceholder = '暂无歌词', primaryColor } = props;

  const artist = info?.artist;
  const name = info?.name;
  const lyricEl = useRef<HTMLUListElement>(null);
  const lyricItemEl = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (lyricEl.current && lyricItemEl.current) {
      if (lyricEl.current.scrollTo && lyricIndex > 0) {
        lyricEl.current.scrollTo(0, (lyricIndex + 1 + 0.5) * lyricItemEl.current.offsetHeight);
      }
    }
  }, [lyricIndex]);

  const content = lyric.length ? (
    <ul className={'cool-lyric-content'} ref={lyricEl}>
      {Object.keys(tLyric).length
        ? lyric.map((v, i) => {
            return (
              <li
                key={v.time}
                ref={lyricItemEl}
                style={i === lyricIndex ? { color: primaryColor } : undefined}
                className={'lyric-item-normal t-lyric-item-normal'}
              >
                <div>{v.lyric}</div>
                <div>{tLyric[v.time]}</div>
              </li>
            );
          })
        : lyric.map((v, i) => {
            return (
              <li
                className="lyric-item-normal"
                key={v.time}
                ref={lyricItemEl}
                style={i === lyricIndex ? { color: primaryColor } : undefined}
              >
                {v.lyric}
              </li>
            );
          })}
    </ul>
  ) : (
    <div className={'cool-lyric-center-wrapper'}>
      <span className={'cool-lyric-center'}>{lyricPlaceholder}</span>
    </div>
  );
  return (
    <div className={'cool-lyric'}>
      <div className="cool-lyric-title-wrapper">
        <h4 title={`${name} ${artist ? artist : ''}`}>
          {name} {artist ? `(${artist})` : ''}
        </h4>
      </div>
      {loading ? (
        <div className="cool-lyric-center-wrapper">
          <span className="cool-lyric-center">loading...</span>
        </div>
      ) : (
        content
      )}
    </div>
  );
};

export default LyricNormal;

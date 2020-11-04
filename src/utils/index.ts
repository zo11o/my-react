export const fixedBody = () => {
  let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  document.body.style.cssText = `position:fixed;top-${scrollTop}px;width:100%;overflow:hidden;`;
};

export const looseBody = () => {
  let body = document.body;
  body.style.position = '';
  let top = body.style.top;
  document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
  document.body.style.cssText = '';
  body.style.top = '';
};

export const getTime = (musicTime?: number) => {
  if (musicTime === 0) {
    return '00:00';
  }

  let time;

  if (musicTime) {
    musicTime = Math.ceil(musicTime);
    if (musicTime < 60) {
      time = `00:${musicTime < 10 ? `0${musicTime}` : musicTime}`;
    } else {
      time = `${
        parseInt(`${musicTime / 60}`, 0) < 10
          ? `0${parseInt(`${musicTime / 60}`, 0)}`
          : parseInt(`${musicTime / 60}`, 0)
      }:
          ${musicTime % 60 < 10 ? `0${musicTime % 60}` : musicTime % 60}`;
    }
    return time;
  } else {
    return '00:00';
  }
};

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

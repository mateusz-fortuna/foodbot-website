export const throttle = (fn, wait) => {
  let time = Date.now();

  return (...args) => {
    if (time + wait - Date.now() < 0) {
      fn(...args);
      time = Date.now();
    }
  };
};

export default throttle;

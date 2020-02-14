export const throttle = ( fn, time ) => {
  let wait = Date.now();

  return ( ...args ) => {
    if ( time + wait - Date.now() < 10 ) {
      fn( ...args );
      time = Date.now();
    }
  };
};
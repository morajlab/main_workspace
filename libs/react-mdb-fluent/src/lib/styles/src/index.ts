export const Styles = () => {
  require('./lib/mdb.min.css');

  return { Prism };
};

export const RTLStyles = () => {
  require('./lib/mdb.rtl.min.css');

  return { Prism };
};

export const Prism = () => {
  require('./lib/prism.css');
};

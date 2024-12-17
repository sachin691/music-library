const requestLogger = (req, res, next) => {
  const { method, url } = req;
  console.log(`${method} ${url} at ${new Date().toISOString()}`);
  next();
};

module.exports = requestLogger;

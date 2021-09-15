class Logger {
  static log(...args) {
    console.log(...args)
  }
  static debug(...args) {
    if (process.env.DEBUG == 'true') console.debug(...args)
  }
  static error(...args) {
    console.error(...args)
  }
}

module.exports = Logger

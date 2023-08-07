const fs = require('fs')

const createLogger = (sqlFilePath) => {
  fs.writeFile(sqlFilePath, '', () => {})
  const logger = fs.createWriteStream(sqlFilePath, {
    flags: 'a',
  })
  return logger
}

module.exports = createLogger

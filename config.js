require('dotenv').config()
module.exports = {
  debug: process.env.DEBUG?.toLowerCase() == 'true',
  token: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  leaveOnEnd: process.env.BOT_LEAVE_ON_QUEUE_END?.toLowerCase() != 'false',
  leaveOnEndTimeout: (() => {
    let timeout = 0
    try {
      timeout = parseInt(process.env.BOT_LEAVE_ON_QUEUE_END_TIMEOUT)
    } catch {
      timeout = 0
    }
    return timeout
  })(),
  leaveOnEmpty:
    process.env.BOT_LEAVE_ON_EMPTY_CHANNEL?.toLowerCase() != 'false',
  leaveOnEmptyTimeout: (() => {
    let timeout = 0
    try {
      timeout = parseInt(process.env.BOT_LEAVE_ON_EMPTY_CHANNEL_TIMEOUT)
    } catch {
      timeout = 0
    }
    return timeout
  })(),
  initialVolume: (() => {
    let initialVolume = 100
    try {
      initialVolume = parseInt(process.env.BOT_INITIAL_VOLUME)
    } catch (error) {
      initialVolume = 100
    }
    return initialVolume
  })(),
}

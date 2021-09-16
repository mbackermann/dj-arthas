const Logger = require('../logger/Logger')
class GuildsTimeout {
  constructor(client) {
    this.config = client.config
    this.timeouts = new Map()
  }

  setTimeout(queue) {
    try {
      if (!this.config.leaveOnEnd || this.config.leaveOnEndTimeout == 0) return

      let timeout = setTimeout(() => {
        try {
          queue.connection.disconnect()
        } catch (error) {
          Logger.error(
            'Error trying to disconnect after leaveOnEndCooldown',
            error
          )
        }
      }, this.config.leaveOnEndTimeout * 1000)
      this.timeouts.set(queue.guild.id, timeout)
    } catch (error) {
      Logger.error(error)
    }
  }

  clearTimeout(queue) {
    try {
      if (!this.config.leaveOnEnd || this.config.leaveOnEndTimeout == 0) return
      let timeout = this.timeouts.get(queue.guild.id)
      if (timeout) {
        clearTimeout(timeout)
        this.timeouts.delete(queue.guild.id)
      }
    } catch (error) {
      Logger.error(error)
    }
  }
}

module.exports = GuildsTimeout

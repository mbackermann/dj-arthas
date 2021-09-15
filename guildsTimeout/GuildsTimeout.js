class GuildsTimeout {
  constructor(client) {
    this.config = client.config
    this.timeouts = new Map()
  }

  setTimeout(queue) {
    try {
      if (!this.config.leaveOnEnd || this.config.leaveOnEndTimeout == 0) return

      let timeout = setTimeout(() => {
        console.log('Timeout!')
        try {
          queue.connection.disconnect()
        } catch (error) {
          console.error(
            'Error trying to disconnect after leaveOnEndCooldown',
            error
          )
        }
      }, this.config.leaveOnEndTimeout * 1000)
      this.timeouts.set(queue.guild.id, timeout)
    } catch (error) {
      console.error(error)
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
      console.error(error)
    }
  }
}

module.exports = GuildsTimeout

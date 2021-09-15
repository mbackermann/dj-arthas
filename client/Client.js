const { Client, Intents, Collection } = require('discord.js')
const fs = require('fs')

class DiscordClient extends Client {
  constructor(config) {
    super({
      intents: [
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS,
      ],
    })

    this.commands = new Collection()

    const commandFiles = fs
      .readdirSync('commands/bot-commands')
      .filter((file) => file.endsWith('.js'))

    for (const file of commandFiles) {
      const command = require(`../commands/bot-commands/${file}`)
      this.commands.set(command.name, command)
    }

    this.config = config
  }
}

module.exports = DiscordClient

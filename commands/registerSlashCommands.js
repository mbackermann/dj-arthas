const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const Logger = require('../logger/Logger')

const registerSlashCommands = async (guildIds, client) => {
  const rest = new REST({ version: '9' }).setToken(client.config.token)
  try {
    Logger.log('Started refreshing application (/) commands.')
    guildIds.forEach(async (guildId) => {
      await rest.put(
        Routes.applicationGuildCommands(client.config.clientId, guildId),
        {
          body: client.commands,
        }
      )
    })
    Logger.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    Logger.error(error)
  }
}

module.exports = registerSlashCommands

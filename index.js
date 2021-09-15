require('dotenv').config()
const Logger = require('./logger/Logger')
const DiscordClient = require('./client/Client')
const GuildsTimeout = require('./guildsTimeout/GuildsTimeout')
const { Player } = require('discord-player')
const registerSlashCommands = require('./commands/registerSlashCommands')
const config = require('./config.js')

const client = new DiscordClient(config)
const player = new Player(client)
const guildsTimeout = new GuildsTimeout(client)

client.once('ready', async (client) => {
  Logger.log('Discord Bot ready!')
  Logger.debug('Client ready', client)
  await client.user.setActivity('/help', { type: 'LISTENING' })
  const guildIds = Array.from((await client.guilds.fetch()).keys())
  registerSlashCommands(guildIds, client)
})

client.on('guildCreate', async (guild) => {
  Logger.log('Bot joined a guild!', guild)
  registerSlashCommands([guild.id], client)
})

player.on('trackStart', (queue, track) => {
  Logger.debug('trackStarted', queue, track)
  queue.metadata.channel.send(
    `🎶 | Now playing **${track.title}** in **${queue.connection.channel.name}**!`
  )
})

player.on('error', (queue, error) => {
  Logger.error(
    `[${queue.guild.name}] Error emitted from the player: ${error.message}`
  )
  try {
    queue.metadata.interaction.followUp({
      content: `❌ **I failed to execute that command.** Encountered: \`${error.message}\``,
    })
  } catch (error) {
    Logger.error(error)
  }
})

player.on('connectionError', (queue, error) => {
  Logger.error(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  )
})

player.on('trackAdd', (queue, track) => {
  Logger.debug('trackAdded', queue, track)
  try {
    queue.metadata.channel.send(`🗒️ | **${track.title}** added to queue!`)
    guildsTimeout.clearTimeout(queue)
  } catch (error) {
    Logger.error(error)
  }
})

player.on('connectionCreate', (queue, connection) => {
  Logger.debug('playerConenctionCreated', queue, connection)
  try {
    queue.metadata.interaction.followUp({
      content: `👍 **Joined \`${connection.channel.name}\` and bound to <#${queue.metadata.channel.id}>**`,
    })
    Logger.log(
      `New Voice Connection on ${
        queue.guild.id
      }. Total voice connections: ${client.addVoiceConnection(queue.guild.id)}`
    )
  } catch (error) {
    Logger.error(error)
  }
})

player.on('botDisconnect', (queue) => {
  Logger.debug('playerBotDisconnected', queue)
  Logger.log(
    `Voice Channel on Guild ${
      queue.guild.id
    } disconnected. Total voice connections: ${client.deductVoiceConnection(
      queue.guild.id
    )}`
  )
  try {
    guildsTimeout.clearTimeout(queue)
  } catch (error) {
    Logger.error(error)
  }
})

player.on('channelEmpty', (queue) => {
  Logger.debug('playerChannelEmptied', queue)
  try {
    queue.metadata.channel.send('❌ | Leaving the channel, nobody is here')
    guildsTimeout.clearTimeout(queue)
  } catch (error) {
    Logger.error(error)
  }
})

player.on('queueEnd', (queue) => {
  Logger.debug('queueEnded', queue)
  try {
    queue.metadata.channel.send('✅ | You have no more tracks in queue!')
    guildsTimeout.setTimeout(queue)
  } catch (error) {
    Logger.error(error)
  }
})

client.on('interactionCreate', async (interaction) => {
  Logger.debug('interactionCreated', interaction)
  const command = client.commands.get(interaction.commandName.toLowerCase())
  try {
    command.execute(interaction, player)
  } catch (error) {
    Logger.log(error)
    interaction.followUp({
      content: 'There was a problem executing the command that you requested',
    })
  }
})
client.login(client.config.token)
Logger.debug('Bot Settings', client.config)

require('dotenv').config()
const DiscordClient = require('./client/Client')
const { Player } = require('discord-player')
const registerSlashCommands = require('./commands/registerSlashCommands')

const config = {
  token: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
}
const client = new DiscordClient(config)
const player = new Player(client)

client.once('ready', async (client) => {
  console.log('Discord Bot ready!')
  const guildIds = Array.from((await client.guilds.fetch()).keys())
  registerSlashCommands(guildIds, client)
})

client.on('guildCreate', async (guild) => {
  registerSlashCommands([guild.id], client)
  console.log('Bot joined a guild!', guild)
})

player.on('trackStart', (queue, track) => {
  try{
    queue.metadata.channel.send(
      `🎶 | Now playing **${track.title}** in **${queue.connection.channel.name}**!`
    )
  }catch(error){
    console.error(error)
  }
})

player.on('error', (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the player: ${error.message}`
  )
})

player.on('connectionError', (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  )
})

player.on('trackAdd', (queue, track) => {
  try {
    queue.metadata.send(`🎶 | **${track.title}** added to queue!`)
  }catch(error){
    console.error(error)
  }
})

player.on('botDisconnect', (queue) => {
  try{
    queue.metadata.send(
      '❌ | I was manually disconnected from the voice channel, clearing queue!'
    )
  }catch(error){
    console.error(error)
  }
  
})

player.on('channelEmpty', (queue) => {
  try{
    queue.metadata.send('❌ | Leaving the channel, nobody is here')
  }catch(error){
    console.error(error)
  }
})

player.on('queueEnd', (queue) => {
  try{
    queue.metadata.send('✅ | You have no more tracks in queue!')
  }catch(error){
    console.error(error)
  }
  
})

client.on('interactionCreate', async (interaction) => {
  const command = client.commands.get(interaction.commandName.toLowerCase())
  try {
    command.execute(interaction, player)
  } catch (error) {
    console.log(error)
    interaction.followUp({
      content: 'There was a problem executing the command that you requested',
    })
  }
})

client.login(client.config.token)

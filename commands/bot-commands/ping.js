module.exports = {
  name: 'ping',
  description: 'Just a ping',
  emoji: '🏓',
  execute(interaction) {
    return void interaction.reply({
      content: 'Pong!',
      ephemeral: true,
    })
  },
}

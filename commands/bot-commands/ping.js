module.exports = {
  name: 'ping',
  description: 'Just a ping',
  execute(interaction) {
    return void interaction.reply({
      content: 'Pong!',
      ephemeral: true,
    })
  },
}

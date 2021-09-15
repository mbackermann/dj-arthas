module.exports = {
  name: 'help',
  description: "List bot's commands",
  emoji: '❓',
  execute(interaction, player) {
    let msg = '**I can answer the following commands**'
    const commands = player.client.commands
      .sort((a, b) => {
        if (a.key < b.key) {
          return -1
        }
        if (a.key > b.key) {
          return 1
        }
        return 0
      })
      .forEach((value, key) => {
        msg += `\n${value.emoji} **/${key}** - ${value.description}`
      })
    return void interaction.reply({
      content: msg,
      ephemeral: true,
    })
  },
}

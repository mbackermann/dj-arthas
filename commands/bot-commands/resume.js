const { GuildMember } = require('discord.js')

module.exports = {
  name: 'resume',
  description: 'Resume current song',
  emoji: '▶',
  async execute(interaction, player) {
    try {
      if (
        !(interaction.member instanceof GuildMember) ||
        !interaction.member.voice.channel
      ) {
        return void interaction.reply({
          content: 'You are not in a voice channel!',
          ephemeral: true,
        })
      }

      if (
        interaction.guild.me.voice.channelId &&
        interaction.member.voice.channelId !==
          interaction.guild.me.voice.channelId
      ) {
        return void interaction.reply({
          content: 'You are not in my voice channel!',
          ephemeral: true,
        })
      }

      await interaction.deferReply()
      const queue = player.getQueue(interaction.guildId)
      if (!queue || !queue.playing) {
        return void interaction.followUp({
          content: "❌ There's no song being played",
        })
      }
      const paused = queue.setPaused(false)
      return void interaction.followUp({
        content: paused ? '▶ | Resumed!' : "❌ | Couldn't resume your song",
      })
    } catch (error) {
      console.log(error)
      interaction.followUp({
        content: `There was an error trying to pause your song: ${error.message}`,
      })
    }
  },
}

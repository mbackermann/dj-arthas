const { GuildMember } = require('discord.js')
const Logger = require('../../logger/Logger')

module.exports = {
  name: 'pause',
  description: 'Pause your current track',
  emoji: '⏸',
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

      const permissions = interaction.member.voice.channel.permissionsFor(
        interaction.guild.me
      )

      if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return void interaction.reply({
          content: "I don't have permission to join your voice channel!",
          ephemeral: true,
        })
      }

      await interaction.deferReply()
      const queue = player.getQueue(interaction.guildId)
      if (!queue || !queue.playing) {
        return void interaction.followUp({
          content: "❌ There's no track being played",
        })
      }
      const paused = queue.setPaused(true)
      return void interaction.followUp({
        content: paused ? '⏸ | Paused!' : "❌ | Couldn't pause your track",
      })
    } catch (error) {
      Logger.log(error)
      interaction.followUp({
        content: `There was an error trying to pause your track: ${error.message}`,
      })
    }
  },
}

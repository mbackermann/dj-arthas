const { GuildMember } = require('discord.js')
const Logger = require('../../logger/Logger')

module.exports = {
  name: 'skip',
  description: 'Skip the current track',
  emoji: '⏭️',
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
          content: "❌ There's no track being played",
        })
      }
      const skipped = queue.skip()
      return void interaction.followUp({
        content: skipped
          ? `⏭️ | Skipped current track`
          : `❌ | Coulnd't skip this track!`,
      })
    } catch (error) {
      Logger.log(error)
      interaction.followUp({
        content: `There was an error trying to skip your track: ${error.message}`,
      })
    }
  },
}

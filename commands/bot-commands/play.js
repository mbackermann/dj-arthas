const { GuildMember } = require('discord.js')
const { QueryType } = require('discord-player')
const Logger = require('../../logger/Logger')

module.exports = {
  name: 'play',
  description: 'Play a track based on your search terms or url',
  emoji: '🎶',
  options: [
    {
      name: 'search',
      type: 3,
      description:
        'The terms that you want to search or the URL of the YouTube video',
      required: true,
    },
  ],
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

      const search = interaction.options.get('search').value
      const searchResult = await player
        .search(search, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch(() => {})
      if (!searchResult || !searchResult.tracks.length)
        return void interaction.followUp({
          content: 'No results were found for your search!',
        })
      const queue = await player.createQueue(interaction.guild, {
        metadata: {
          channel: interaction.channel,
          interaction: interaction,
        },
        leaveOnEnd:
          player.client.config.leaveOnEnd &&
          player.client.config.leaveOnEndTimeout == 0,
        leaveOnStop: false,
        leaveOnEmpty: player.client.config.leaveOnEmpty,
        leaveOnEmptyCooldown: player.client.config.leaveOnEmptyTimeout * 1000,
        initialVolume: player.client.config.initialVolume,
      })

      try {
        if (!queue.connection)
          await queue.connect(interaction.member.voice.channel)
      } catch {
        void player.deleteQueue(interaction.guildId)
        return void interaction.followUp({
          content: 'Could not join your voice channel!',
        })
      }

      await interaction.followUp({
        content: `⏱ | Loading your ${
          searchResult.playlist ? 'playlist' : 'track'
        } \`${search}\`...`,
      })
      searchResult.playlist
        ? queue.addTracks(searchResult.tracks)
        : queue.addTrack(searchResult.tracks[0])
      if (!queue.playing) await queue.play()
    } catch (error) {
      Logger.log(error)
      interaction.followUp({
        content:
          'There was an error trying to add your track to queue: ' +
          error.message,
      })
    }
  },
}

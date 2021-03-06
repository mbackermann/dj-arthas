# DJ Arthas - Discord Music Bot #

![DJ Arthas](/images/logo.jpg)

## Add DJ Arthas to your server
[Add me to your server](https://bit.ly/3nMRhnB)

## Requirements
- [FFmpeg](https://www.ffmpeg.org/)
- [Node](https://nodejs.org/en/) v.16x or higher
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Installation
1. Install dependencies
```
yarn install
# or
npm install
```

2. Create a `.env` file out of `.env.example`
```
cp .env.example .env
```

3. Set Discord Bot token and Discord Client ID on `.env`
```
DISCORD_BOT_TOKEN={YOUR_TOKEN}
DISCORD_CLIENT_ID={YOUR_CLIENT_ID}
```

4. Run it!
```
yarn start
# or
npm start
```

## Configuration
### Environment Variables
| Variable Name | Description | Accepted Values | Default | Required |
| --- | --- | --- | --- | --- |
|DISCORD_BOT_TOKEN| Token from your Discord Bot | NA | null | true |
|DISCORD_CLIENT_ID| Discord Client ID | NA | null | true |
|BOT_LEAVE_ON_QUEUE_END| Whether the bot should leave the channel after the queue has ended | true/false | true | false |
|BOT_LEAVE_ON_QUEUE_END| Whether the bot should leave the channel after the queue has ended | true/false | true | false |
|BOT_LEAVE_ON_QUEUE_END_TIMEOUT | The cooldown in seconds that the bot should wait before leaving the channel. It requires `BOT_LEAVE_ON_QUEUE_END` to be `true` to work | Integer | 0 | | false |
|BOT_LEAVE_ON_EMPTY_CHANNEL| Whether the bot should leave the channel if no one is there and the queue has ended | true/false | true | false |
|BOT_LEAVE_ON_EMPTY_CHANNEL_TIMEOUT| The cooldown in seconds that the bolt should wait before leaving the channel if no one is there. It requires `BOT_LEAVE_ON_EMPTY_CHANNEL` to be `true` | Integer |0| false |
|BOT_INITIAL_VOLUME|The volume that the bot should start playing when requested.| [0-100] | 100| false |
|DEBUG| Shows debug information when logging | true/false | false| false |
## Commands
### `/help`
- List bot's commands
### `/pause`
- Pauses the current track.
### `/ping`
- Just a ping. I will reply with a pong.
### `/play [terms or url]`
- Play a track based on your search terms or url
### `/resume`
- Resumes the current track
### `/skip`
- Skip the current track
### `/stop`
- Stops the current queue and clears it
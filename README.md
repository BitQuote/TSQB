# Tech support queue bot

## Functionality

 - Users can create tickets
 - Bot posts ticket info in a channel
 - Mods can resolve tickets
 - Everything saved to Rethink

## Setup

 1. Install [RethinkDB](https://www.rethinkdb.com/docs/install/) and start the server
 3. Fill out the info in *config.js*
 4. Run `npm install` to fetch dependencies
 5. Start the bot with `npm start` or use something like [PM2](http://pm2.keymetrics.io/)

## Technical bits

 - ESLint rules: [Airbnb](https://github.com/airbnb/javascript)
 - RethinkDB driver: official
 - Ticket document fields:
   - `id` (rethink key)
   - `message_id` (snowflake)
   - `user_id` (snowflake)
   - `timestamp`
   - `description` (text)
 - Bot messages in *strings.json*

## Misc

This bot is not official supported. Do not complain about how horribly it is written or ask me for support. Updates/fixes are not guaranteed and will only be provided if I am in a good mood and I have some spare time.

Licensed under [MIT](https://opensource.org/licenses/MIT). Copyright © 2017 BitQuote.

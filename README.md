# Playlist Archive Server

This a playlist archive server, designed for plug.dj

## Requirements

* postgres 9.4
* node 4.x
* webpack
* nodemon

#### Optional for running `scripts/downloadMedia.js`

* ffmpeg [i used this](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu)
* youtube-dl

## Setup


* run `db.sql` to create databases
* `npm install`
* rename env_sample to .env and fill in your database username, password and name
* `npm start`
* Goto `/#/changePassword?hash=qdnhbl8n1vsfg292kz53zk8m0000gn` to set your first account password and username


Sample Audio from http://www.bensound.com/
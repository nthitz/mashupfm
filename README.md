# Playlist Archive Server

This a playlist archive server, designed for plug.dj

## Requirements

* postgres 9.4
* node
* webpack
* nodemon

#### Optional for running `scripts/downloadMedia.js`

* ffmpeg [i used this](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu)
* youtube-dl

## Setup

* run `db.sql` to create databases
* rename env_sample to .env and fill in your database username, password and name
* Goto `/#/changePassword?hash=qdnhbl8n1vsfg292kz53zk8m0000gn` to set your first account password and username
* `npm start`


Sample Audio from http://www.bensound.com/
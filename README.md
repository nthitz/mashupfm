# Playlist Archive Server

This a playlist archive server, designed for plug.dj

## Requirements

* postgres
* node
* ffmpeg [i used this](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu)
* youtube-dl

## Setup

* run `db.sql` to create databases
* hopefully you have some data to import with `scripts/importPlugPlaylists.js`
* you'll probably want to download some media with `scripts/downloadMedia.js`
* `node index.js`

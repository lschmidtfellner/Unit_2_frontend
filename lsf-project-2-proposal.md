# Project Proposal

For my second project, I aim to create a web app that takes an input of one or more track/artist from spotify and generates a playlist based around it. I also want to incorporate an option that filters for only less popular music in order to dredge up deeper tracks.

## Routes and models

I will be using a model for songs that stores only a few of the properties of spotify's song documents.

First i will be using a GET request to the spotify API that accepts the parameter of a song URL or objectID to fetch a songs information from spotify. Then comes another get request to spotify that uses the genre/popularity parameters to search for music that shares the same genres. From there, each chosen song will be POSTed on my remote API as a document. A DELETE request will be put in place to handle disposing of entire playlists, and a PUT request will be up for editing songs within existing playlists.

## User Stories

- As a user, I want to be able to save my liked songs, ideally specifically under my username.
- As a user, I want confirmation that my inputs went through, and that the get request is successful.
- As a user, I want to see my entire playlist with song previews and album art, and have the option to remove songs from my playlist.
- As a user, I should be able to browse all of my past playlists.

#### MVP Goals

I want a simple interface in which I can feed a song url and a popularity quotient. I want to return a list of 20 songs (or however many match the parameters), and I want to see them presented in a clear concise manner.

#### Stretch Goals

I want to store playlists or individual songs on my remote API, and make them retrievable at a later time. I want to embed song previews, album art, and other info. I want to see if I can effectively implement a loading screen.

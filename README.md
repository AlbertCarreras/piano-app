# PIANO FRIEND APP

## What's Piano Friend?

Piano Friend is a web app that allows you to play a short range of piano notes on Chrome, record songs and save them on a Rails API. You can also shared them with friends. 

## Demo video (How to use)

https://www.youtube.com/watch?v=nU9_5UOYNgo&feature=youtu.be

## Technologies

### Front-end
#### Set up
1. Clone repository.
1. Install dependencies `npm install`.
1. Start your server `npm start`.

Github:
Front-end 
https://github.com/AlbertCarreras/piano-app

Vanilla Javascript

* **App Structure** The app has a main file index.js, 2 libraries, and 3 class objects. 
  - Libraries support the app with modular functionality. The libraries are built with IIFE and namespacing.
  - Class objects are used to create audio context, audio notes and song notes instances (audio notes with timing and duration).

* **AudioContext** Web API for sounds (notes) 
* **Webpack** Implemented for building app> Needed after implementing import/export functionality.
  
### Back-end 
#### Setup
1. Clone repo.
1. Install Gems `bundle install`.
1. Set up Database `rake db:create`, then run `rake db:migrate`.
1. Start your server `rails s`.

Github:
Back-end
https://github.com/AlbertCarreras/piano_api

Rails API with with serialization and Postgres

## Authors
ALBERTO CARRERAS
* acarrerasc @gmail.com
* https://github.com/AlbertCarreras
* https://medium.com/@a.carreras.c/
* https://www.linkedin.com/in/albertcarreras/en

Max Smouha (www.maxsmouha.com/) was project partner for the first version of the app. Max Smouha implemented most of CSS styling for the single page app.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
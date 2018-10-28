//HTML ELEMENTS
let songName = document.getElementById('song_name');
let displayUrlSong = document.getElementById('displayUrlSong');
const songSelector = document.getElementById("song_names");
const container = document.getElementById("container");
const shareUrlEl = document.getElementById("shareUrlSong");
//buttons
const playBtn = document.getElementById("play");
const frqRange = document.getElementById('frqRange');
let volumeControl = document.querySelector("input[name='volume']");
const copypaste = document.getElementById('copypaste');

export {
    songName, 
    displayUrlSong, 
    songSelector,
    container,
    shareUrlEl,
    playBtn,
    frqRange,
    volumeControl,
    copypaste
}
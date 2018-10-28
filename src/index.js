//IMPORTS
import * as htmlEl from './htmlElements';
import * as ct from './constants';
import SongNote from './songNote';
import Audio from './audio';

//CONSTANT VARIABLES
//new audiocontext
const audio = new Audio()

//DYNAMIC VARIABLES
  //avoids multiple keydown events at once storing true/false states on each note
  const aBoolObjects = {};
  //stores an oscillator for each note via f createNote
  const noteObjects = {};
  //song variables
  let currentSongId = "";
  let currentSong = [];
  let endNoteTime = "";

// >>>
// >>> FUNCTIONALITY
// >>>

//SONG SELECTOR FUNCTIONALITY
//Fetches all of the song names for the song selector
function init() {
  fetch(`${ct.apiUrl}/api/v1/songs`).then(r => r.json()).then(r => {
    displaySongs(r);
    getSong();
  })
  if (getUrl() != "undefined") {
    console.log("you've got a song");
  } else {
    htmlEl.displayUrlSong.style.display = "none";
  }
}
init()

//populates song selector with song option
function displaySongs(songs) {
  htmlEl.songSelector.innerHTML = "";
  songs.reverse().forEach(function(song) {
    htmlEl.songSelector.innerHTML += `
         <option value="${song.id}">${song.name}</option>
                `
  })
}

//listener router
htmlEl.container.addEventListener("click", function(e){
  if (e.target.dataset.action === "playLoad") {
    activatePlaySong();
  }
  else if (e.target.dataset.action === "playUrl") {
    getSongFromUrl();
    activatePlaySong();
  }
  else if (e.target.dataset.action === "visitSongUrl") {
    getToUrl();
  }
})

//changes/downloads song when selector is changed
function getSong() {
  fetch(`${ct.apiUrl}/api/v1/songs/${htmlEl.songSelector.value}`).then(r => r.json()).then(r => {
    currentSong = r;
    currentSongId = r.id;
  })
}

//checks if new song is chosen, fetches new song
htmlEl.songSelector.addEventListener("change", function() { 
  if (currentSongId === songSelector.value) {
    return
  } else {
    getSong();
  }
})

//plays song, disables playbtn and sets timeout for song duration for abling btn again
function activatePlaySong(){
  playSong(currentSong);
  htmlEl.songName.value = `Playing: ${currentSong.name}`;
  htmlEl.playBtn.disabled = true;
  htmlEl.playBtn.style = "background:grey;color:#fff;";
  setTimeout(() => {
    htmlEl.playBtn.disabled = false;
    htmlEl.playBtn.style = "";
    htmlEl.songName.value = ""
  }, endNoteTime * 1000);
}

//NOTES
//builds noteObjects from list of notes and their frequencies (frequencyList)
function createNote(key) { //for each note,
  let osc = audio.ac.createOscillator();
  let frequency = ct.frequencyList[key];
  osc.frequency.value = frequency * htmlEl.frqRange.value;
  osc.setPeriodicWave(audio.customWaveform); //waveform for tone
  osc.connect(audio.masterGainNode);
  noteObjects[key] = osc;
  aBoolObjects[key] = true;
}

//Iterates over frequency list creating & storing notes
function createNotes() {
  Object.keys(ct.frequencyList).forEach(
    key => createNote(key)
  )
}

createNotes();

//PLAYING FUNCTIONALITY
//Monkey patching adding startTime function to OscillatorNode to save ac.currentTime on each instance
OscillatorNode.prototype.startTime = function() {
  this.starter = audio.ac.currentTime;
}

//Plays notes from playSong() and eventlisteners
function playNote(note, duration, timeIn) {
  //create new oscillator object to reset pitch
  createNote(note); 
  aBoolObjects[note] = false;

  let osc = noteObjects[note];
  //sets start time (.starter) of new oscillator
  osc.startTime();
  if (timeIn) {
    songNoteStarter(note, duration, timeIn, osc);
  } else {
    singleNoteStarter(osc, note);
  }
}

//Get key closure
const getKey = (note) => document.getElementById(note);

function songNoteStarter(note, duration, timeIn, osc) {
  osc.start(audio.ac.currentTime + timeIn);
  stopNote(note, duration, timeIn);
  setTimeout(() => {
    getKey(note).style = "background: #fff7ae!important"
  }, timeIn * 1000);
}

function singleNoteStarter(osc, note) {
  osc.start();
  getKey(note).style = "background: #fff7ae!important;"; //highlights current note
}

function stopNote(note, duration, timeIn) {
  let osc = noteObjects[note];

  if (duration) {
    songNoteStopper(note, duration, timeIn, osc);
  } else {
    singleNoteStopper(osc, note);
  }

  aBoolObjects[note] = true;

  let lengthSecNote = audio.ac.currentTime - osc.starter; // note duration
  let timeInNote = osc.starter - newRecordingTimeIn;
  noteRecorder(note, lengthSecNote, timeInNote); //saves note on Recording Variable
}

function songNoteStopper(note, duration, timeIn, osc) {
  osc.stop(audio.ac.currentTime + timeIn + duration);
  setTimeout(() => getKey(note).style = "", (timeIn + duration) * 1000);
}

function singleNoteStopper(osc, note) {
  osc.stop();
  getKey(note).style = "";
}

//REPLAY SONG FUNCTIONALITY
//iterates over the array and plays the song
function playSong(song) {
  song.notes.forEach(
    note => {
      playNote(note.note, note.duration, note.time_in);
      endNoteTime = note.time_in + note.duration;
    }

  )
}

//PLAY NOTES WITH EVENTLISTENERS
//plays note when pressing key
const getKeyValues = (event) => ct.keyValues[event.key.toUpperCase()];

document.addEventListener('keydown',
  function(event) {
    if (aBoolObjects[getKeyValues(event)]) {
      playNote(getKeyValues(event));
    }
  }
)

document.addEventListener('keyup',
  function(event) {
    if (aBoolObjects[getKeyValues(event)] == false) {
      stopNote(getKeyValues(event));
    }
  }
)

//plays note when clicking keyboard
document.addEventListener('mousedown',
  function(event) {
    if (event.target.className.includes('note')) {
      let note = event.target.dataset.note;
      playNote(note);
    }
  }
)

document.addEventListener('mouseup',
  function(event) {
    if (event.target.className.includes('note')) {
      let note = event.target.dataset.note;
      stopNote(note);
    }
  }
)

//RECORDING FUNCTIONALITY
let recording = false;
let newRecording = []; //const to let
let newRecordingTimeIn = "";

const recordBtn = document.getElementById('record');

recordBtn.addEventListener('click',
  function() {
    recording = !recording;
    console.log(recording);
    if (recording) {
      startRecording();
    } else {
      stopRecording();
    }
  }
)

const startRecording = () => {
  recordBtn.innerHTML = "Stop";
  recordBtn.style = "background:red;color:#fff;";
  saveBtn.style = "background:grey;color:#fff;";
  saveBtn.disabled = true;
  newRecording = [];
  newRecordingTimeIn = audio.ac.currentTime;
}

const stopRecording = () => {
  recordBtn.innerHTML = "Record";
  recordBtn.style = "";
  saveBtn.style = "";
  saveBtn.disabled = false;
}


function noteRecorder(note, duration, timeIn) {
  if (recording === false) {
    return
  } else {
    let newNote = new SongNote(note, duration, timeIn);
    newRecording.push(newNote);
  }
}

//SAVING FUNCTIONALITY
const saveBtn = document.getElementById('save_song');

saveBtn.addEventListener('click',
  function() {
    saveBtn.style = "background:red;color:#fff;";
    saveBtn.innerHTML = "Saving";
    setTimeout(function() {
      saveBtn.style = "";
      saveBtn.innerHTML = "Save";
      htmlEl.songName.value = "Your song was saved! Check the list."
    }, 1000);

    currentSong = {
      name: htmlEl.songName.value,
      notes: newRecording
    }
    postSong(currentSong);

    generateShareUrl();

    setTimeout(() => htmlEl.songName.value = "", 5000);
  }
)

function jsonStringify(currentSong) {
  return JSON.stringify(currentSong);
}

function jsonParser(jsonObj) {
  return JSON.parse(jsonObj);
}

function postSong(currentSong) {
  fetch(`${ct.apiUrl}/api/v1/songs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: jsonStringify(currentSong)
  }).then(r => r.json()).then(init)
}

//SHARING FUNCTIONALITY
//creates url with song values
function encodedSongUrl() {
  let encodedSong = encodeURIComponent(jsonStringify(currentSong));
  return `${ct.htmlUrl}?song=${encodedSong}`;
}

function generateShareUrl() {
  htmlEl.shareUrlEl.value = encodedSongUrl();
}

//copy-pasting url from url box
htmlEl.copypaste.addEventListener('click', function(event){
  event.preventDefault();
  htmlEl.shareUrlEl.select();
  try
    { copied = document.execCommand('copy'); }
  catch (ex)
    { copied = false; }
  if (copied)
    { console.log('copied!'); }
});

//gets decoded song from url
function getUrl(){
  return decodeURIComponent(window.location.href.split(`${ct.htmlUrl}?song=`)[1]);
}

//saves the song encoded in the url into currentSong
function getSongFromUrl(){
  currentSong = jsonParser(getUrl());
}

//opens new window with passed url (with encoded song)
function getToUrl(){ //opens new window with url containing song
   window.open(`${htmlEl.shareUrlEl.value}`);
}

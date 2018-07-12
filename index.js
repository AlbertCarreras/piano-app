//NEW AUDIOCONTEXT
const ac = new AudioContext();

//CONSTANTS VARIABLES
const frequencyList = {"C": 32.70, "C#":34.65, "D":36.71, "Eb":38.89,	"E":41.20, "F":43.65, "F#":46.25,	"G":49.00, "G#":51.91,	"A":55.00,	"Bb":58.27,	"B":61.74} // frequency - key hash
const keyValues = { "A":"C", "W":"C#", "S":"D", "E":"Eb", "D":"E", "F":"F" , "R":"F#", "G":"G" , "T":"G#", "H":"A" , "Y":"Bb", "J":"B" } //key - note hash for keypress

//DYNAMIC VARIABLES
const aBoolObjects = {}
const noteObjects = {}

//BUTTONS
const frqRange = document.getElementById('frqRange')

//VOLUME & WAVEFORM FUNCTIONALITY
let volumeControl = document.querySelector("input[name='volume']");
const masterGainNode = ac.createGain();

masterGainNode.connect(ac.destination);

masterGainNode.gain.value = volumeControl.value;

function changeVolume(event) { masterGainNode.gain.value = volumeControl.value }

volumeControl.addEventListener("change", changeVolume, false);

//Creates custom waveform for oscillators in createNote
const sineTerms = new Float32Array([0, 0, 1, 0, 1]);
const cosineTerms = new Float32Array(sineTerms.length);
const customWaveform = ac.createPeriodicWave(cosineTerms, sineTerms);


 
//SONG SELECTOR FUNCTIONALITY
//Fetches all of the song names for the song selector
function init() {
    fetch("http://localhost:3000/api/v1/songs").then(r=>r.json()).then(r => {displaySongs(r); getSong()})
 }
 
 init()

//populates song selector with song option
const songSelector = document.getElementById("song_names")

function displaySongs(songs) {
   songSelector.innerHTML = ""
   songs.reverse().forEach(function(song){
      songSelector.innerHTML += `
         <option value="${song.id}">${song.name}</option>
                `
   })
}

//play button and song variables
const playBtn = document.getElementById("play")
let currentSongId = ""
let currentSong = []

//changes/downloads song when selector is changed
function getSong() {
    fetch(`http://localhost:3000/api/v1/songs/${songSelector.value}`).then(r=>r.json()).then(r => {currentSong = r; currentSongId = r.id;})
}

songSelector.addEventListener("change", function(){ //checks if new song is chosen, fetches new song
    if (currentSongId === songSelector.value) {
        return
    } else {
        getSong()
    }
})

playBtn.addEventListener("click", function(){ //plays selected song when play is clicked
    playSong(currentSong)
})

//NOTES
//builds noteObjects from list of notes and their frequencies (frequencyList)
function createNote(key) { //for each note, 
    let osc = ac.createOscillator();
    let frequency = frequencyList[key]
    osc.frequency.value = frequency*frqRange.value;
    osc.setPeriodicWave(customWaveform); //waveform for tone
    osc.connect(masterGainNode);
    noteObjects[key] = osc;
    aBoolObjects[key] = true;
}

//Iterates over frequency list
function createNotes() { 
    Object.keys(frequencyList).forEach(
        key => createNote(key)
    )
}

createNotes()

//PLAYING FUNCTIONALITY
//Monkey patching adding startTime function to OscillatorNode to save ac.currentTime on each instance
OscillatorNode.prototype.startTime = function () { this.starter = ac.currentTime}

//Plays notes from playSong() and eventlisteners
function playNote(note, duration, timeIn) {
    createNote(note); //create new oscillator object to reset pitch
    aBoolObjects[note] = false;

    let osc = noteObjects[note]
    osc.startTime() //sets start time (.starter) of new oscillator
    if (timeIn) {
        songNoteStarter(note, duration, timeIn, osc)
    } else { 
        singleNoteStarter(osc, note)
        }
}

const getKey = (note) => document.getElementById(note) //Get key closure

function songNoteStarter(note, duration, timeIn, osc) {
    osc.start(ac.currentTime + timeIn);
    stopNote(note, duration, timeIn);
    setTimeout(()=> { getKey(note).style="background: #fff7ae!important" }, timeIn*1000)
}

function singleNoteStarter(osc, note) {
    osc.start(); 
    getKey(note).style="background: #fff7ae!important;" //highlights current note
}

function stopNote(note, duration, timeIn) {
    let osc = noteObjects[note]

    if (duration) {
        songNoteStopper(note, duration, timeIn, osc)
    } else {
        singleNoteStopper(osc, note)
    }

    aBoolObjects[note] = true;

    let lengthSecNote = ac.currentTime - osc.starter // note duration
    let timeInNote = osc.starter - newRecordingTimeIn
    noteRecorder(note, lengthSecNote, timeInNote) //saves note on Recording Variable
}

function songNoteStopper(note, duration, timeIn, osc) {
    osc.stop(ac.currentTime + timeIn + duration);
    setTimeout(()=> getKey(note).style="", (timeIn + duration)*1000)
}

function singleNoteStopper(osc, note) {
    osc.stop()
    getKey(note).style=""
}

//REPLAY SONG FUNCTIONALITY
//iterates over the array and plays the song

function playSong(song) {
    song.notes.forEach(
        note => playNote(note.note, note.duration, note.time_in)
    )
 }

//PLAY NOTES WITH EVENTLISTENERS
//plays note when pressing key
document.addEventListener('keydown',
    function (event) {
      if (aBoolObjects[keyValues[event.key.toUpperCase()]]) {
          console.log(keyValues[event.key.toUpperCase()])
          playNote(keyValues[event.key.toUpperCase()])
        }
    }
)

document.addEventListener('keyup',
   function (event){
    if (aBoolObjects[keyValues[event.key.toUpperCase()]] == false) {
        stopNote( keyValues[event.key.toUpperCase()] )
    }
   }
)

//plays note when clicking keyboard
document.addEventListener('mousedown',
  function(event) {
        if (event.target.className.includes('note')) {
            let note = event.target.dataset.note
            playNote(note)
        }
  }
)

document.addEventListener('mouseup',
  function(event) {
        if (event.target.className.includes('note')) {
            let note = event.target.dataset.note
            stopNote(note)
        }
  }
)

//RECORDING FUNCTIONALITY
let recording = false
let newRecording = []//const to let
let newRecordingTimeIn

const recordBtn = document.getElementById('record')
recordBtn.addEventListener('click',
    function(event) {
        recording = !recording
        console.log(recording)
        if (recording) {
            recordBtn.innerHTML = "Stop"
            recordBtn.style="background:red;color:#fff;"
            saveBtn.style="background:grey;color:#fff;"
            saveBtn.disabled = true
            newRecording = []
            newRecordingTimeIn = ac.currentTime
        } else {
            recordBtn.innerHTML = "Record"
            recordBtn.style=""
            saveBtn.disabled = false
            saveBtn.style=""
        }
    }
)

function noteRecorder(note, duration, timeIn) {
    if (recording === false) {
        return
    } else {
        let newNote = new Note(note, duration, timeIn)
        newRecording.push(newNote)
    }
}

//SAVING FUNCTIONALITY
const saveBtn = document.getElementById('save_song')

saveBtn.addEventListener('click',
    function () {
        saveBtn.style="background:red;color:#fff;";
        saveBtn.innerHTML = "Saving";
        setTimeout(function() { saveBtn.style= ""; saveBtn.innerHTML = "Save"; songName.value = "Your song was saved! Check the list." }, 1000);

        let songName = document.getElementById('song_name')

        fetch("http://localhost:3000/api/v1/songs",
            { method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: songName.value, notes: newRecording})}
        ).then(r => r.json()).then(init)

        currentSong = {name: songName.value, notes: newRecording}

        setTimeout(()=> songName.value = "", 5000)
    }
)

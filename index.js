//NEW AUDIOCONTEXT
const ac = new AudioContext();
//CONSTANTS VARIABLES
const frequencyList = {"C": 32.70, "C#":34.65, "D":36.71, "Eb":38.89,	"E":41.20, "F":43.65, "F#":46.25,	"G":49.00, "G#":51.91,	"A":55.00,	"Bb":58.27,	"B":61.74} // frequency - key hash
const keyValues = { "A":"C", "W":"C#", "S":"D", "E":"Eb", "D":"E", "F":"F" , "R":"F#", "G":"G" , "T":"G#", "H":"A" , "Y":"Bb", "J":"B" } //key - note hash for keypress
const noteObjects = {}
//DYNAMIC VARIABLES
const aBoolObjects = {}

let currentSong = []

//SONG SELECTOR FUNCTIONALITY
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

//changes/downloads song when selector is changed
songSelector.addEventListener("change", function(){
    if (currentSongId === songSelector.value) {
        return
    } else {
        fetch(`http://localhost:3000/api/v1/songs/${songSelector.value}`).then(r=>r.json()).then(r => {currentSong = r; console.log(r)})
    }
})

playBtn.addEventListener("click", function(){
  playSong(currentSong)
})

function init() {
   fetch("http://localhost:3000/api/v1/songs").then(r=>r.json()).then(displaySongs)
}
init()

//NOTES
//builds noteObjects from frequencyList
function createNotes() {
    Object.keys(frequencyList).forEach(
        key => createNote(key)
    )
}
const sineTerms = new Float32Array([0, 0, 1, 0, 1]);
const cosineTerms = new Float32Array(sineTerms.length);
const customWaveform = ac.createPeriodicWave(cosineTerms, sineTerms);

function createNote(key) {
    let frequency = frequencyList[key]
    let osc = ac.createOscillator();
    osc.type = customWaveform; //waveform for tone
    osc.connect(ac.destination);
    osc.frequency.value = frequency*document.getElementById('frqRange').value;
    noteObjects[key] = osc;
    aBoolObjects[key] = true;
}

createNotes()

//PLAYING FUNCTIONALITY
//monkey patching adding startTime function to OscillatorNode to save ac.currentTime on each instance
OscillatorNode.prototype.startTime = function () { this.starter = ac.currentTime}

//Plays notes from playSong() and eventlisteners
function playTone(note, duration, timeIn) {
    createNote(note);
    let osc = noteObjects[note]
    osc.startTime()
    document.getElementById(note).style="background: #fff7ae!important;" //highlights current note
    if (timeIn) {
        osc.start(ac.currentTime + timeIn);
        stopTone(note, duration, timeIn); 
    } else { osc.start() }
    aBoolObjects[note] = false;
}

function stopTone(note, duration, timeIn) {
    let osc = noteObjects[note]
    if (duration) {
      osc.stop(ac.currentTime + timeIn + duration);
    } else {
      osc.stop(ac.currentTime + 0.5)
    }
    aBoolObjects[note] = true;
    let lengthSecNote = ac.currentTime - osc.starter // note duration
    let timeInNote = osc.starter - newRecordingTimeIn
    console.log(lengthSecNote)
    noteRecorder(note, lengthSecNote, timeInNote) //saves note on Recording Variable
    createNote(note)
    Array.from( document.getElementsByClassName('note')).forEach(element => element.style="")
}

//REPLAY SONG FUNCTIONALITY
//iterates over the array and plays the song

function playSong(song) {
    song.notes.forEach(
        note => playTone(note.note, note.duration, note.time_in)
    )
 }

//PLAY NOTES WITH EVENTLISTENERS
//plays note when pressing key
document.addEventListener('keydown',
    function (event) {
      if (aBoolObjects[keyValues[event.key.toUpperCase()]]) { 
          playTone(keyValues[event.key.toUpperCase()])
        }
    }
)

document.addEventListener('keyup',
   function (event){
    if (aBoolObjects[keyValues[event.key.toUpperCase()]] == false) { 
        stopTone( keyValues[event.key.toUpperCase()] )
    }
   }
)

//plays note when clicking keyboard
document.addEventListener('click',
  function(event) {
        if (event.target.className.includes('note')) {
            let note = event.target.dataset.note
            playTone(note)
            stopTone(note)
        }
  }
)

let recording = false
let newRecording = []//const to let
let newRecordingTimeIn

//RECORDING FUNCTIONALITY
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

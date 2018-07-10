const ac = new AudioContext();
const frequencyList = {"C": 32.70, "C#":34.65, "D":36.71, "Eb":38.89,	"E":41.20, "F":43.65, "F#":46.25,	"G":49.00, "G#":51.91,	"A":55.00,	"Bb":58.27,	"B":61.74} //frequency - key hash
const keyValues = { "A":"C", "W":"C#", "S":"D", "E":"Eb", "D":"E", "F":"F" , "R":"F#", "G":"G" , "T":"G#", "H":"A" , "Y":"Bb", "J":"B" } //key - note hash for keypress
const noteObjects = {}

const song1 = ["C", "F#", "Eb", "F", "G", "A", "B"] //demo song
let notes = []

createNotes()

function createNotes() {
    Object.keys(frequencyList).forEach(
        key => createNote(key)
    )
}

function createNote(key) {
    let frequency = frequencyList[key]
    let osc = ac.createOscillator();
    osc.type = 'sawtooth'; //waveform for tone
    osc.connect(ac.destination);
    osc.frequency.value = frequency*2.5;
    noteObjects[key] = osc;
}

//Plays note
let aBool = true

function playTone(note, callback) {
    let osc = noteObjects[note]
        document.getElementById(note).style="background: #fff7ae!important;" //highlights current note
        osc.start();
        aBool = false
        console.log('playtone ' + aBool)
    if (callback) {stopTone(note, callback)}
}

function stopTone(note, callback) {
    let osc = noteObjects[note]
    osc.stop(ac.currentTime + 0.5);
    aBool = true
    console.log('stopTone '+ aBool)
    createNote(note)
    if (callback) {osc.onended = function() {
        Array.from( document.getElementsByClassName('note')).forEach(element => element.style="")
        callback();
         } 
    } else {
        Array.from( document.getElementsByClassName('note')).forEach(element => element.style="")
    }
}

//plays note when pressing key
document.addEventListener('keydown',
    function (event) {
        console.log('keydown ' + aBool)
           if (aBool) {playTone(keyValues[event.key.toUpperCase()])}
        } 
)

document.addEventListener('keyup',
   event => stopTone( keyValues[event.key.toUpperCase()] )

)


//iterates over the array and plays the song
function playSong(song) {
    notes = [...song]
    playMelody()
}
function playMelody(){
	if (notes.length > 0){
        let note = notes.shift();
        console.log(note)
        playTone(note, playMelody);
	}
}

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


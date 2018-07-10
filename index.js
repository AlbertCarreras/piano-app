const ac = new AudioContext();
const frequencyList = {
  "C": 32.70,
  "C#": 34.65,
  "D": 36.71,
  "Eb": 38.89,
  "E": 41.20,
  "F": 43.65,
  "F#": 46.25,
  "G": 49.00,
  "G#": 51.91,
  "A": 55.00,
  "Bb": 58.27,
  "B": 61.74
} //frequency - key hash
const keyValues = {
  "A": "C",
  "W": "C#",
  "S": "D",
  "E": "Eb",
  "D": "E",
  "F": "F",
  "R": "F#",
  "G": "G",
  "T": "G#",
  "H": "A",
  "Y": "Bb",
  "J": "B"
} //key - note hash for keypress

const song1 = ["C", "D", "E", "F", "G", "A", "B"] //demo song
let playingSong = []

//Plays note
function playTone(note, callback) {
  let frequency = frequencyList[note]
  let osc = ac.createOscillator();
  osc.type = 'square'; //waveform for tone

  osc.connect(ac.destination);
  osc.frequency.value = frequency;
  osc.start();
  osc.stop(ac.currentTime + 0.32);
  if (callback != undefined) {
    osc.onended = function() {
      var arr = Array.from(document.getElementsByClassName('ivory')).forEach(element => element.style = "");
      callback();
    }
  }
}

//iterates over the array and plays the song
function playMelody() {
  if (playingSong.length > 0) {
    let note = playingSong.shift();
    console.log(note);
    document.getElementById(note).style = "background: #fff7ae!important;"
    playTone(note[0], playMelody);
  }
}
//duplicates song temporilly. iteration while playing is destructive
function playSong(song) {
  playingSong = [...song];
  playMelody();
}

//plays note when clicking keyboard
document.addEventListener('click',
  function(event) {
    if (event.target.className.includes('note')) {
      let note = event.target.dataset.note
      playTone(note)
    }
  }
)
let  millisecondClock
//plays note when pressing key
document.addEventListener('keydown',
  (event) => {
    millisecondClock = new Date(milliseconds);
    debugger;
    playTone(keyValues[event.key.toUpperCase()]);
  }
)

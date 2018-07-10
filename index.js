const ac = new AudioContext();
const frequencyList = {"C": 32.70, "C#":34.65, "D":36.71, "Eb":38.89,	"E":41.20, "F":43.65, "F#":46.25,	"G":49.00, "G#":51.91,	"A":55.00,	"Bb":58.27,	"B":61.74} //frequency - key hash
const keyValues = { "A":"C", "W":"C#", "S":"D", "E":"Eb", "D":"E", "F":"F" , "R":"F#", "G":"G" , "T":"G#", "H":"A" , "Y":"Bb", "J":"B" } //key - note hash for keypress

const song1 = ["C#", "C#", "Eb", "F", "G", "A", "B", ""] //demo song
let notes = []

//Plays note
function playTone(note, callback) {
    let frequency = frequencyList[note]
    let osc = ac.createOscillator();

    osc.type = 'sawtooth'; //waveform for tone

    osc.connect(ac.destination);
    osc.frequency.value = frequency*2.5;
    osc.start();
    document.addEventListener('keyup',
        function() {osc.stop(ac.currentTime)}
    )
    if (callback) {osc.onended = callback}
}

//iterates over the array and plays the song
function playSong(song) {
    notes = [...song]
    playMelody()
}
function playMelody(){
	if (notes.length > 0){
        Array.from( document.getElementsByClassName('note')).forEach(element => element.style="") //removes highlight on each pass
        let note = notes.shift();
        console.log(note)
        playTone(note[0], playMelody);
        document.getElementById(note).style="background: #fff7ae!important;" //highlights current note
	}
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

//plays note when pressing key
let keyBool = true

document.addEventListener('keydown',
    function (event) {
        if (keyBool) {
            playTone(keyValues[event.key.toUpperCase()])
            console.log(event)
            keyBool = false
        } 
    }
)

document.addEventListener('keyup',
    function (event) {
        if (!keyBool) {
            console.log(event)
            keyBool = true
        }
    }
)
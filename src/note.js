import * as ct from './constants';
import * as htmlEl from './htmlElements';

class Notes {
    constructor() {
        //avoids multiple keydown events at once storing true/false states on each note
        this.aBoolObjects = {};
        //stores an oscillator for each note via f createNote
        this.noteObjects = {};
    }

    //Iterates over frequency list creating & storing notes
    createNotes(audioCxt) {
        Object.keys(ct.frequencyList).forEach(
            key => this.createNote(key, audioCxt)
        )
    }
    
    //builds noteObjects from list of notes and their frequencies (frequencyList)
    createNote(key, audioCxt) { //for each note,
        let osc = audioCxt.ac.createOscillator();
        let frequency = ct.frequencyList[key];
        osc.frequency.value = frequency * htmlEl.frqRange.value;
        osc.setPeriodicWave(audioCxt.customWaveform); //waveform for tone
        osc.connect(audioCxt.masterGainNode);
        this.noteObjects[key] = osc;
        this.aBoolObjects[key] = true;
    }
}

export default Notes;
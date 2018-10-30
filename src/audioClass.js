import { volumeControl } from './htmlElements';

class Audio{
    constructor() {
        // Initializes audio context
        this.ac = new(window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext)

        // Initializes volume node with volume functionality
        this.masterGainNode = (function (ac, volumeCallback) {
            let gainNode = ac.createGain();
            gainNode.connect(ac.destination);
            gainNode.gain.value = volumeControl.value;
            
            //listener for volume functionality
            volumeControl.addEventListener("change", volumeCallback.bind(this, volumeControl), false);
            return gainNode;
        })(this.ac, () => this.changeVolume(volumeControl))

        // Creates custom waveform for oscillators in createNote
        this.sineTerms = new Float32Array([0, 0, 1, 0, 1]);
        this.cosineTerms = new Float32Array(this.sineTerms.length);
        this.customWaveform = this.ac.createPeriodicWave(this.cosineTerms, this.sineTerms);

        //Monkey patching adding startTime function to OscillatorNode to save ac.currentTime on each instance
        //IIFE for executing monkey patching
        //.startTime is a method of osc and this in this.starter will equal to osc
        this.addStartTimeToOsc = (function (audio) {
            OscillatorNode.prototype.startTime = function() {
                this.starter = audio.ac.currentTime;
            }
        })(this)
    }

    changeVolume(volumeControl) {
        this.masterGainNode.gain.value = volumeControl.value
    }


}

export default Audio;

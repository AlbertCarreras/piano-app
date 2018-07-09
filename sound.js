//currently not in use

class Sound {
    constructor(frequency) {
        this.osc = ac.createOscillator();
        this.osc.frequency.value = frequency;
        this.osc.start(0);
    }

    play() {

    }

}
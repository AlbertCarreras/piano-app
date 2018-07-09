const ac = new AudioContext();
const frequencyList = {"C": 32.70, "C#":34.65, "D":36.71, "Eb":38.89,	"E":41.20, "F":43.65, "F#":46.25,	"G":49.00, "G#":51.91,	"A":55.00,	"Bb":58.27,	"B":61.74}


function playTone(note) {
    let frequency = frequencyList[note]
    let osc = ac.createOscillator();

    osc.type = 'square';

    osc.connect(ac.destination);
    osc.frequency.value = frequency*2.5;
    osc.start();
    osc.stop(ac.currentTime + 0.5);
  }

  document.addEventListener('click',
  function(event) {
            if (event.target.className === "ivory") {
          let note = event.target.dataset.note
          playTone(note)
      }
  }
)

const ac = new AudioContext();

function playTone(note) {

    const frequency = {
      "0":
        {"C": 16.35, "C#":17.32, "D":18.35, "Eb":19.45,	"E":20.60, "F":21.83, "F#":23.12,	"G":24.50, "G#":25.96,	"A":27.50,	"Bb":29.14,	"B":30.87},
      "1":
        {"C": 32.70, "C#":34.65, "D":36.71, "Eb":38.89,	"E":41.20, "F":43.65, "F#":46.25,	"G":49.00, "G#":51.91,	"A":55.00,	"Bb":58.27,	"B":61.74}
      }

    var osc = ac.createOscillator();

    osc.type = 'sawtooth';

    osc.connect(ac.destination);

    osc.frequency.value = note;
    osc.start();
    osc.stop(ac.currentTime + 0.5);
  }

  document.addEventListener('click',
  function(event) {
      if (event.target.id === "start") {
          let note = event.target.dataset.note
          playTone(note)
      }
  }
)

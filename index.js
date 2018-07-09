const ac = new AudioContext();

function playTone(note) {
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
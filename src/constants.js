//piano notes
// frequency - key hash
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
  }
  //key - note hash for keypress
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
  }

  //url
  const apiUrl = 'https://pianofriend-api.herokuapp.com';
  const htmlUrl = 'https://albertcarreras.github.io/piano-app/';
  

  export {
    frequencyList,
    keyValues, 
    apiUrl,
    htmlUrl
  }
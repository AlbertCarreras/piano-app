let helpers = (function () {
    return {

      jsonStringify: function jsonStringify(currentSong) {
        return JSON.stringify(currentSong);
      },
      
      jsonParser: function jsonParser(jsonObj) {
        return JSON.parse(jsonObj);
      }
      
    }
})()

export default helpers;
import helpers from './../lib/helpers';
import * as ct from './../src/constants';

let songUrl = (function () {

    return {
        //SHARING FUNCTIONALITY
        //creates url with song values
        encodedSongUrl: function encodedSongUrl(currentSong) {
          let encodedSong = encodeURIComponent(helpers.jsonStringify(currentSong));
          return `${ct.htmlUrl}?song=${encodedSong}`;
        },
        
        //appends url to html element
        generateShareUrl: function generateShareUrl(htmlElement, currentSong) {
          htmlElement.value = this.encodedSongUrl(currentSong);
        },
          
        //gets decoded song from url
        getUrl: function getUrl(){
            return decodeURIComponent(window.location.href.split(`${ct.htmlUrl}?song=`)[1]);
          },
          
        //saves the song encoded in the url into currentSong
        getSongFromUrl:  function getSongFromUrl(){
            return helpers.jsonParser(this.getUrl());
          },
          
        //opens new window with passed url (with encoded song)
        getToUrl:  function getToUrl(url){ //opens new window with url containing song
             window.open(`${url}`);
          }
    }
})();

export default songUrl;
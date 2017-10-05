(function() {
     function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        /*
        * @desc the album information
        * @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum(); 
         
        /*      
        * @desc Buzz object audio file
        * @type {Object}
        */
        currentBuzzObject = null;

        /*
         * @function setSong
         * @desc Stops currently playing song and loads new audio file as currentBuzzObject
         * @param {Object} song
         */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }
            currentBuzzObject = new buzz.sound(song.audioUrl, {formats: ['mp3'], preload: true});
            
            /*            
            The bind() method adds an event listener to the Buzz sound 
            object – in this case, we listen for a timeupdate event.
            */
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            SongPlayer.currentSong = song;
        }; 
  
        /*
         * @function playSong
         * @desc Plays currently playing song and sets song playing attribute to true
         * @param {Object} song
         */
        var playSong = function(song) {
                currentBuzzObject.play();
                song.playing = true;
            };
         
        /*
        * @function getSongIndex
        * @desc  Get the index of a song
        * @param {Object} song
        * @returns {Number}
        */      
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        }; 
         
        /*
        * @function stopSong
        * @desc  Stop playing the current song
        */      
        var stopSong = function() {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
        };
         
        /*
        *@desc newly chosen song object
        * @type {Object}
        */
        SongPlayer.currentSong = null;
         
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;
         

        /*
        * @function SongPlayer.play
        * @desc  Play the song
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }              
        };

        /*
        * @function SongPlayer.pause
        * @desc  pause the song
        * @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
 
        /*
        * @function SongPlayer.previous
        * @desc  go to previous song and play it
        * @param {Object} song
        */
         SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
             
            if (currentSongIndex < 0) {
                stopSong();
            } else {
             var song = currentAlbum.songs[currentSongIndex];
             setSong(song);
             playSong(song);
            }
        };

        /*
        * @function SongPlayer.next
        * @desc  go to next song and play it
        * @param {Object} song
        */
         SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
             
            if (currentSongIndex > currentAlbum.songs.length-1) {
                stopSong();
            } else {
             var song = currentAlbum.songs[currentSongIndex];
             setSong(song);
             playSong(song);
            }
        };
         
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
         
        /**
        * @desc Current volume of currently playing song
        * @type {Number}
        */
        SongPlayer.volume = null;

        /**
        * @function setVolume
        * @desc Update the volume on change
        * @param {Number} volume
        */
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
        };


         return SongPlayer;
     }
 
     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();
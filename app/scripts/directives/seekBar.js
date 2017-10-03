(function () {
    function seekBar($document) {
        /* @function calculatePercent
        *  @desc   Calculates the horizontal percent along the
        *          seek bar where the event (passed in from the
        *          view as  $event) occurred.
        *  @params {Object} seekBar Holds the element that matches
        *                           the directive.
        *  @returns {Number}
        */
        var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        };
        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: { },
            link: function (scope, element, attributes) {
                /*@desc Holds the value of the seek bar,
                *       such as the currently playing song
                *       time or the current volume.
                *       Default value is 0.
                * @type {Number}
                */
                scope.value = 0;
                /*@desc Holds the maximum value of the    
                *       song and volume seek bars. 
                *       Default value is 100.
                * @type {Number}
                */
                scope.max = 100;
                
                var seekBar = $(element);  
                
                /* @function percentString
                 * @desc     A function that calculates a
                 *           percent based on the value and
                 *           maximum value of a seek bar.
                 * @returns {String}
                 */
                var percentString = function () {

                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };
                /* @function fillStyle
                 * @desc     Returns the width of the seek
                 *           bar fill element based on the
                 *           calculated percent.
                 * @returns {String}
                 */
                scope.fillStyle = function() {
                    return {width: percentString()};
                };
                 /* @function onClickSeekBar
                 * @desc     Updates the seek bar value based on 
                 *           the seek bar's width and the location 
                 *           of the user's click on the seek bar.
                 * @params {Object} event
                 */               
                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                };
                /* @function thumbStyle
                 * @desc     updates the position of the seek bar thumb
                 * @returns {String}
                 */
                scope.thumbStyle = function() {
                    return {left: percentString()};
                }; 
                
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                        });
                    });
 
                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };
             }
        };
     }
 
     angular
         .module('blocJams')
         .directive('seekBar', ['$document', seekBar]);
 })();
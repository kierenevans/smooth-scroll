/*jslint browser: true */
(function (window, document) {
    "use strict";

var prefixes = ['moz', 'webkit', 'o'],
      animationFrame;

    // Modern rAF prefixing without setTimeout
    function requestAnimationFrameNative() {
        prefixes.map(function(prefix) {
            if (!window.requestAnimationFrame) {
                animationFrame = window[prefix + 'RequestAnimationFrame'];
            } else {
                animationFrame = requestAnimationFrame;
            }
        });
    }
    requestAnimationFrameNative();

    function getOffsetTop(el) {
        if (!el) {
            return 0;
        }

        var yOffset = el.offsetTop,
            parent = el.offsetParent;

        yOffset += getOffsetTop(parent);

        return yOffset;
    }

    function getScrollTop(scrollable) {
        return scrollable.scrollTop || document.body.scrollTop || document.documentElement.scrollTop;
    }

    function scrollTo(scrollable, coords, millisecondsToTake) {
        var currentY = getScrollTop(scrollable),
            diffY = coords.y - currentY,
            startTimestamp = null;

        if (coords.y === currentY || typeof scrollable.scrollTo !== 'function') {
            return;
        }

        function doScroll(currentTimestamp) {
            if (startTimestamp === null) {
                startTimestamp = currentTimestamp;
            }

            var progress = currentTimestamp - startTimestamp,
                fractionDone = (progress / millisecondsToTake),
                pointOnSineWave = Math.sin(fractionDone * Math.PI / 2);
            scrollable.scrollTo(0, currentY + (diffY * pointOnSineWave));

            if (progress < millisecondsToTake) {
                animationFrame(doScroll);
            } else {
                // Ensure we're at our destination
                scrollable.scrollTo(coords.x, coords.y);
            }
        }

        animationFrame(doScroll);
    }

    // Declaire scroll duration, (before script) 
   var speed = window.smoothScrollSpeed || 1000; 

    function smoothScroll(e) {   // no smooth scroll class to ignore links
        if(e.target.className === 'no-ss'){
            return;
        }

        var source = e.target,
            targetHref = source.hash,
            target = null;

        if (!source || !targetHref) {
            return;
        }

        targetHref = targetHref.substring(1);
        target = document.getElementById(targetHref);
        if (!target) {
            return;
        }

        scrollTo(window, {
            x: 0,
            y: getOffsetTop(target)
        }, speed);
    }

    // Uses target's hash for scroll
    document.addEventListener('click', smoothScroll, false);

}(window, document));

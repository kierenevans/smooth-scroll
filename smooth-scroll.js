/*jslint browser: true */
(function (window, document) {
    "use strict";

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
                window.requestAnimationFrame(doScroll);
            } else {
                // Ensure we're at our destination
                scrollable.scrollTo(coords.x, coords.y);
            }
        }

        window.requestAnimationFrame(doScroll);
    }

    function smoothScroll(e) {
        e.preventDefault();

        var source = e.target,
            targetHref = source.getAttribute('href'),
            target = null;

        if (!source || !targetHref) {
            return;
        }

        targetHref = targetHref.substring(targetHref.indexOf('#') + 1);
        target = document.getElementById(targetHref);
        if (!target) {
            return;
        }

        scrollTo(window, {x: 0, y: getOffsetTop(target)}, 1000);
    }

    var targets = document.querySelectorAll('.js_smoothScroll'),
        target = null;
    for (target in targets) {
        if (typeof targets[target] === 'object') {
            targets[target].addEventListener('click', smoothScroll);
        }
    }
}(window, document));

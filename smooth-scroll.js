(function(window, document) {
    var getOffsetTop = function(el) {
        if(!el) {
            return 0;
        }
        var yOffset = el.offsetTop;
        var parent = el.offsetParent;
        yOffset += getOffsetTop(parent);
        return yOffset;
    }; 
    var getScrollTop = function(scrollable) {
        return scrollable.scrollTop || document.body.scrollTop || document.documentElement.scrollTop;
    };
    var smoothScroll = function(e) {
        e.preventDefault();
        
        var source = e.target;
        if(!source) {
            return;
        }
        
        var targetHref = source.getAttribute('href');
        if(!targetHref) {
            return;
        }
        
        targetHref = targetHref.substring(targetHref.indexOf('#') + 1);
        var target = document.getElementById(targetHref);
        if(!target) {
            return;
        }
        
        var offsetY = getOffsetTop(target);
        
        scrollTo(window, {x: 0, y: offsetY}, 1000);
    };
    
    var scrollTo = function(scrollable, coords, millisecondsToTake) {
        var currentY = getScrollTop(scrollable);
        if (coords.y == currentY || typeof scrollable.scrollTo !== 'function') {
            return;
        }
        
        var diffY = coords.y - currentY;
        
        var iterations = millisecondsToTake / 1000 * 60;
        var perIteration = diffY / iterations;

        var startTimestamp = null;
        var doScroll = function(currentTimestamp) {
            var progress;
            if(startTimestamp === null) {
            	startTimestamp = currentTimestamp;
            }
            progress = currentTimestamp - startTimestamp;
            var fractionDone = (progress / millisecondsToTake);
            var pointOnSineWave = Math.sin(fractionDone * Math.PI / 2);
            scrollable.scrollTo(0, currentY + (diffY * pointOnSineWave));

            if(progress < millisecondsToTake) {
            	window.requestAnimationFrame(doScroll);
            } else {
            	// Ensure we're at our destination
                scrollable.scrollTo(coords.x, coords.y);
            }
        };
        
        window.requestAnimationFrame(doScroll);
    };
    
    var targets = document.querySelectorAll('.js_smoothScroll');
    for(var i in targets) {
        if(typeof targets[i] === 'object') {
            targets[i].addEventListener('click', smoothScroll);
        }
    }
})(window, document);
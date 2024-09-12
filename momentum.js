function SmoothScroll(target, speed, smooth) {
    if (target === document)
        target =
            document.scrollingElement ||
            document.documentElement ||
            document.body.parentNode ||
            document.body; // cross browser support for document scrolling

    var moving = false;
    var pos = target.scrollTop;
    var frame =
        target === document.body && document.documentElement
            ? document.documentElement
            : target; // safari is the new IE

    target.addEventListener("mousewheel", scrolled, { passive: false });
    target.addEventListener("DOMMouseScroll", scrolled, { passive: false });

    function scrolled(e) {

        e.stopPropagation(); // Prevent all scrolling events from bubbling up or affecting other scrollable elements
        e.preventDefault(); // disable default scrolling

        var delta = normalizeWheelDelta(e);

        var scale = 1; // Adjust this value based on platform or device if necessary
        if (Math.abs(delta) < 1) {
            scale = 30; // Handle smaller deltas from trackpads or high-precision devices
        }

        // Cap the delta to avoid large jumps
        delta = Math.max(-1, Math.min(1, delta));

        pos += -delta * speed * scale;
        pos = Math.max(-50, Math.min(pos, target.scrollHeight - frame.clientHeight + 50)); // limit scrolling

        if (!moving) update();
    }

    function normalizeWheelDelta(e) {
        if (e.deltaY) {
            return -e.deltaY; // Standard Wheel Event
        }
        if (e.detail) {
            return -e.detail / 3; // Firefox or older browsers
        }
        return e.wheelDelta / 120; // IE, Safari, Chrome
    }

    function update() {
        moving = true;
        const currentPos = target.scrollTop; // Cache current position

        var delta = (pos - currentPos) / smooth;

        target.scrollTop += delta;

        if (Math.abs(delta) > 0.5 && target.scrollTop !== currentPos) {
            requestFrame(update);  // Continue scrolling only if scroll position changed
        } else {
            moving = false; // Stop if we are close enough or no further movement
        }
    }

    var requestFrame = (function () {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (func) {
                window.setTimeout(func, 1000 / 120);
            }
        );
    })();

    // Attach listeners on hover
    target.addEventListener("mouseenter", function () {
        target.addEventListener("wheel", scrolled, { passive: false });
    });

    // Remove listeners when mouse leaves
    target.addEventListener("mouseleave", function () {
        target.removeEventListener("wheel", scrolled);
    });

    this.scrollTo = function (targetElement) {
        pos = target.scrollTop;
        var targetPos = targetElement.getBoundingClientRect().top + pos;

        function animateScroll() {
            var delta = (targetPos - pos) / smooth;

            pos += delta;

            target.scrollTop = pos;

            if (Math.abs(delta) > 0.5) {
                requestFrame(animateScroll);
            } else {
                moving = false;
            }
        }

        animateScroll();
    };
}

// Function to check if an element is scrollable
function isScrollable(el) {
    const hasScrollableContent = el.scrollHeight > el.clientHeight;
    const overflowYStyle = window.getComputedStyle(el).overflowY;
    const isOverflowAutoOrScroll = overflowYStyle === 'auto' || overflowYStyle === 'scroll';

    return hasScrollableContent && isOverflowAutoOrScroll;
}

// Apply SmoothScroll to all scrollable elements and the document itself
function applySmoothScrollToAll() {
    // Apply to the document (page scroll)
    new SmoothScroll(document, 150, 50);

    // Find all scrollable elements and apply SmoothScroll
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        if (isScrollable(el)) {
            new SmoothScroll(el, 150, 50);
        }
    });
}

// Reapply smooth scroll whenever elements are dynamically added
function reapplySmoothScrollOnMutation() {
    const observer = new MutationObserver(() => {
        applySmoothScrollToAll();
    });

    observer.observe(document.body, {
        childList: true,  // Watch for new elements being added
        subtree: true,    // Observe the entire subtree
    });
}

// Run after the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    applySmoothScrollToAll();
    reapplySmoothScrollOnMutation();  // Observe and reapply for dynamic content
});

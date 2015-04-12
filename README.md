# smooth-scroll
A pure Javascript library enabling smooth scrolling around a page.

The scrolling is even smoother by using `window.requestAnimationFrame()` which syncs with the refresh rate of the monitor!

## How to use
1. Include the library on your page:

    <script src="/js/vendor/smooth-scroll/smooth-scroll.js"></script>

2. Add an ID to the target element to scroll to:

    <section id="foo">
       ...
    </section>

3. Add the `js_smoothScroll` class to the links you want to enable scrolling on, ensuring the href points to the ID defined
   
    <a href="#foo" class="js_smoothScroll">Link text</a>

4. Tada!

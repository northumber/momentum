# Momentum: a javascript smoothscrolling

### Features
It will apply smooth scrolling everywhere in a web page: it also tracks the cursor to smooth scroll a specific div instead of the entire page, and automatically apply the smooth scrolling to every new object even if dinamically loaded (example: ajax request)

### Usage
Place the `momentum.js` in the root of your site and include it where you want:

```<script src="/momentum.js"></script>```

It does not matter if placed in the header or the footer.


If you have a simple page without scrollable content inside, I advise you to use `momentum_page.js` this works very well and (for now) is bug-free, the standard `momentum.js` is not really bug-free for now (some browsers in some situations block the scrolling).

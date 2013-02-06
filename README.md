## Chutes and Ladders in D3

_Visualization of a Markov chain simulation_

This is my for-fun implementation of Nick Berry's [simulations of Chutes and Ladders](http://www.datagenetics.com/blog/november12011/index.html) to explain the Monte Carlo and Markov chain methods.

I implemented the Monte Carlo and Markov chain models in Python [here](https://github.com/roycoding/chutes-and-ladders). This D3.js based project is to visualize the Markov chain simulation, which gives you the probability for being on a given square after a given number of moves.

This visualization depends on D3.js, which is linked in the code itself. It requires a "modern" web browser, meaning you're best bet is to try Chrome/Chromium, Firefox, Safari, or a related browser (as of 2013).

You can see a working version [here](http://cs.unm.edu/~rkeyes/chutesladders/).

License statement: If used in substantially similar form to the original, please attribute this visualization and accompanying text to me, Roy Keyes. Otherwise, feel free to modify and reuse this for any purpose.

The todo list includes:
* Demo with full explanation.
* Give better context (i.e. axes) to line plot.
* Tweak animation timing?

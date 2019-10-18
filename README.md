# ttt: Tic Tac Toe (Project_0 @ GA Sydney)

ttt is the shorthand name for my first project at General Assembly's Software Engineering Immersive course. Shoutout to SEi34 @ GA Sydney!

The primary aim for this project is to deliver an online-hosted, playable Tic Tac Toe game for two players, built from scratch. Feel free to [check out my version!](https://jezzzm.github.io/ttt/)

## Minimum Requirements
* Board rendered in browser with switching player turns
* Display of game result
* HTML, CSS, and JS files
* Online deployment
* Semantic markup

## Design Objectives
In addition to meeting the minimum requirements, I set myself some objectives, primarily to optimise user experience of the site.

* Fully responsive
* Utilise modern CSS display methods (grid + flexbox)
* No third party JS dependencies
	* To ensure lightweight site with minimal ‘fluff'
* Highly readable text
* Clear interactive elements and cues
* Option for human versus computer mode
* Adjustable  3x3 -> n x n board size
	* Computer player still functional but certainly less artificially intelligent and more random as size increases
* Developer-friendly codebase including:
	* Separation of AI, UI and game logic scripts, simplifying future abstraction
	* Tastefully commented code (attempted)
	* Regular and meaningful commits
	* Adheres to DRY principles

## Technologies Utilised
* Vanilla JavaScript
* CSS3
* HTML5
* [water.css](https://github.com/kognise/water.css) for base styling

## Getting Started
Check out the [online demo](https://jezzzm.github.io/ttt/), or feel free to fork/download this repo yourself.


## Reflections on the development of this app
* With game logic coded first and working in console, the UI and AI falls into place more simply
* Planning ahead for n x n board size forces understanding and implementation of reusable/abstractable code
* Consistent display across devices and orientations is a pain!
	* Flexbox and grid makes this slightly nicer
* Discerning the right data to make available from the game logic object for the UI and AI certainly involved back and forth
	* e.g. for square identification: sequential IDs (0 - 8) or row/col coordinates (0,0 -> 2,2), or both?
* Communicating the winning squares from the game logic was tricky but in the end the solution was simple
* Main learning topics:
	* array manipulation and transformation, especially when nested
	* copying data with and without reference to original object/array
	* basic AI development
	* responsive layout methods

## Further Development
* Improvement of AI for boards > 3x3.
	* Implement weighting of options for central (non-edge) squares - currently picks randomly
* Implement 'training mode'
	* Abstraction of opponent AI to provide suggestions for human player regarding their next move
	* Use colour opacity of valid squares to reflect likelihood of success? I.e. darker for best outcome, lighter for worst outcome

## Source
This project’s requirements are set as part of the [General Assembly Software Engineering Immersive](https://generalassemb.ly/education/software-engineering-immersive/sydney) course.

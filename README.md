[![Build Status](https://travis-ci.org/justinj/sol.svg?branch=master)](https://travis-ci.org/justinj/sol)

Sol
===

Sol is a generic solver for twisty puzzles like the Rubik's Cube.
Sol is heavily inspired by [ksolve](https://github.com/cubing/ksolve), which
was initially created by Kåre Krig and later improved by Michael Gottlieb.

The goal of Sol is to make it easy to create solvers for simple puzzles, and to
achieve performance acceptable for real-world use (of which the main
applications are tools for finding algorithms and random-state scramblers).

Issues
======

* The `axes` system is sort of broken and not powerful enough.
It can't describe a situation where you have parallel axes which are not the same face, like in a 3x3 with `L` and `R`.

Easy-ish Tasks
==============

* Allow finding multiple solutions, up to a certain depth, and starting from a certain depth
* split out the orientation that has a backingPerm and the one that doesn't into separate classes
* make the classes use accessors (if it doesn't impact performance too much)
* make the interface of a puzzle more concrete
* use better logging than `console.log`
* There is all sorts of dependency between the order in which properties are added to puzzles during their construction.
The functions which build things should just take the things they need instead of the puzzle itself, for example the transition tables/pruning tables.
* Use ES6 style imports instead of `require`s

Difficult-ish Tasks
===================

* specify legal moves for `solve`
* Figure out how to automatically determine how to validate states. For example, Skewb corners have a very restricted set of valid perms, but it's not clear how we could tell if a given perm is allowable.
One option is to just check presence in the ttable... but that doesn't help if the different components depend on each other in some way
* Allow restricting moves in solutions
* Related to the above, allow defining new moves in terms of others, but in a more transient way than the existing way of actually defining moves.
This would allow reusing a def of a puzzle for other movesets (like skewb where the moves are all wonky)
* More puzzles, like pyra, maybe 5x5 l2c?


Interface of a `Puzzle`
=======================

All the below is subject to change.

A `Puzzle` object satisfies the following interface:

##`getTransitionTables()`

Method which returns a list of transition tables for the puzzle.
A list of tables is used instead of a single table to allow for breaking a puzzle down into smaller pieces.

All the tables should have the same moveset (TODO: at the very least we should verify that they have the same size of moveset)

##`getPruningTables()`

Method which returns a list of pruning tables for the puzzle.
The order should correspond to the order given by `getTransitionTables()`.
TODO: should there just be a method that returns a list of objects of ttables and ptables?

##`solved`

A piece of data representing the solved state of the puzzle.
TODO: this should be an accessor?

##`apply(<state-to-apply-to>, <state-being-applied>`

Takes two states and applies one to the other.

##`index(<state>)`

Map a state to a unique natural number.
The solved state should map to 0.
(TODO: I don't really like this restriction, but I think it's currently depended on. That should be fixed)

This function must be injective, and ideally should be surjective onto the set `{0...<number of states>}`

##`moveEffects`

An object mapping moves to the states they create on a solved puzzle.
TODO: This should maybe be replaced with a function combined with a `moves` property/accessor

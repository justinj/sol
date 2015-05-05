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

Difficult-ish Tasks
===================

* Figure out how to automatically determine how to validate states. For example, Skewb corners have a very restricted set of valid perms, but it's not clear how we could tell if a given perm is allowable.
One option is to just check presence in the ttable... but that doesn't help if the different components depend on each other in some way
* Allow restricting moves in solutions
* Related to the above, allow defining new moves in terms of others, but in a more transient way than the existing way of actually defining moves.
This would allow reusing a def of a puzzle for other movesets (like skewb where the moves are all wonky)

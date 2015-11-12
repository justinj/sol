Issues
======

* The `axes` system is sort of broken and not powerful enough.
It can't describe a situation where you have parallel axes which are not the same face, like in a 3x3 with `L` and `R`.

Easy-ish Tasks
==============

* Kill `buildList`, or at least its helpers
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

* reuse arrays when solving?
* figure out if moveEffects is part of a puzzle's external interface
* Verify that every move given has an inverse (requirement for transition tables to make sense)
* In order to get the speed *and* generality we want, we might need to do some macro stuff.
  For example, we want to be able to define arbitrary solved states, but in the more common case of a *single* solved state, we don't want to be checking every iteration if we have a solved *function*.
  We also might want to avoid function calls (thought this should be benchmarked) and prefer inlining. These two goals are sort of contradictory.
* `Perm`s and `Orie`s should be puzzles.
* specify legal moves for `solve`
* Figure out how to automatically determine how to validate states. For example, Skewb corners have a very restricted set of valid perms, but it's not clear how we could tell if a given perm is allowable.
One option is to just check presence in the ttable... but that doesn't help if the different components depend on each other in some way
* Allow restricting moves in solutions
* Related to the above, allow defining new moves in terms of others, but in a more transient way than the existing way of actually defining moves.
This would allow reusing a def of a puzzle for other movesets (like skewb where the moves are all wonky)
* More puzzles, like pyra, maybe 5x5 l2c?

Other
=====

* test the initialState stuff
* In some contexts, `solved` should be `identity`
* We need to remove `index` as part of a component's external interface.

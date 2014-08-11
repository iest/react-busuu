# Nothing to see here... Move along

...still here?

## TODO

- [ ] Split ExerciseStore into `Store` and `ExerciseStore`, the latter extending off the former. Could use `merge` for this?
- [ ] Move more `RecordingExercise` logic into `ExerciseStore`
- [ ] Change all `setState` calls inside `RecordingExercise.react` to be handled by the Dispatcher and registered callbacks (the flux way)

**What this *is not***: A suggestion to re-write the entire app in react.

**What this *is***: Some ideas to get some conversations going about how our application is currently architected, and how it could be vastly improved.

### Why this is cool:

#### Everything is a commonJS module

The node standard. Forces better structuring, and there are no global namespaces. You want lo-dash? `require` it! As a bonus, the build tool (browserify) will only bundle up modules that have been `require`d by others.

#### Proper model definitions with inheritance

Using [John Resig's teeny JS inheritance lib](http://ejohn.org/blog/simple-javascript-inheritance/) means we can properly define the data models we use and have them inherit properties from their parents. All over our app we have models which could inherit from others: specific exercise types could all be based off a single `Exercise` superclass for example.

#### Highly declarative approach

- Application-wide constants
- All data munging done in one place
- Things that are important are labelled as such

This is especially important when we have a single hub for all actions that happen in the app (the Dispatcher), and we need to check for uniqueness.

But most importantly, everything has it's rightful place, and **each module's responsibilities are clear**.

#### Data-layer is explicit; changes are all event based

Each data-model type has it's own *store*. The models are not only stored in there (cached), but can be fetched, updated, and deleted. Each store is merged with node's `EventEmitter` module, allowing individual components/controller-views to register listeners to specific changes. This means that rather than expose a model directly to the DOM, components can handle model changes however they deem fit.

#### Single hub (dispatcher) handles all view-based actions (and could handle server-based actions too)

Having a single module handle all application actions sounds daunting at first, but is immensely powerful. It essentially becomes a registry of callbacks to stores. This means it could handle dependancies between stores and decide when they should be updated, but could also act as a central place for permissions and analytics tracking for example.

#### 98% Vanilla JS

The only real dependancies are React for rendering the components, and node's eventEmitter for event listeners. Everything else is non-framework specific, vanilla javascript code. No jQuery or Angular here, and we don't need it.

#### Powerful routing

TODO:

- Server-side rendering
- Partial app loading (user only downloads what they need)
- Route authentication
- Transitions (abort/redirect/retry)
- Dynamic segments & query params
- 404s

# Notes

- None of the CSS files have been included in this repo, so you'll need to grab them from the main angular repo
- Same with the fonts
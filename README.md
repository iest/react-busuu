# Nothing to see here... Move along

...still here?

### Why this is cool:

##### Everything is a commonJS module

The node standard. Forces better structuring, and there are no global namespaces. You want lo-dash? `require` it!

##### Proper model definitions with inheritance

Using [John Resig's teeny JS inheritance lib](http://ejohn.org/blog/simple-javascript-inheritance/) means we can properly define the data models we use and have them inherit properties from their parents. All over our app we have models which could inherit from others: specific exercise types could all be based off a single Exercise superclass for example.

##### Highly declarative approach

Application-wide constants are defined in `constants`. This is especially important when we have a single hub for all actions that happen in the app (the Dispatcher), and we need to check for uniqueness. Things that are important are labelled as such!

But most importantly, everything has it's rightful place, and each module's responsibilities are clear.

##### Data-layer is explicit; changes are all event based

Each data-model type has it's own *store*. The models are not only stored in there (cached), but can be fetched, updated, and deleted. Each store is merged with node's `EventEmitter` module, allowing individual components/controller-views to register listeners to specific changes. This means that rather than expose a model directly on the DOM, components can handle model changes however they deem fit.

##### Single hub (dispatcher) handles all view-based actions (and could handle server-based actions too)

Having a single module handle all application actions sounds daunting at first, but is immensely powerful. It essentially becomes a registry of callbacks to stores. This means it could handle dependancies between stores and decide when they should be updated, but could also act as a central place for permissions and analytics tracking.
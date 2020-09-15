# utility-resource-organizer
Placeholder name until I can think of a better one.


This implements a message store system allowing producers to send
resources (data or higher-order functions) to listeners.

This is typically used to create library mods that can receive data from
multiple mods and act on them.

## How to use

This mod exports a global object named `UtilityResourceManager`,
which is available even before the `preload` stage provided your mod
have a dependency on this mod.

This mod also defines two new stages in addition to the ones provided by
the modloader.  `registerResourceGenerators` can
be used for producers and `registerResourceListeners` can be used by
listeners.  To use them, your mod must have a main class which a
`registerResourceListeners()` or `registerResourceGenerators()` methods.
These stages can (and should be) defined as asynchronous in your main class.

`registerResourceListeners` is run before `registerResourceGenerators`.
Both are guaranteed to be complete before your `preload` stage provided
your mod have a dependency on this mod.

Listeners can be added and removed at any time, and producers can send
resources at any time.  But listeners are not required to support
receiving resources at any time.  Check the documentation of the listener
mods to see if it supports adding resources outside of the
`registerResourceGenerators` phase.


### Producers

`UtilityResourceManager` defines two asynchronous methods for producers:

```
UtilityResourceManager.addResourceData(key: string, data: any) -> Promise<void>
UtilityResourceManager.addResourceGenerator(key: string, generator: AsyncFunction) -> Promise<void>
```

`key` is used to multiplex resources, and must match the `key` parameter
used by the listeners that must receive the resource.

The generator function is expected to be run more than once if there
is more than one listener.  The specification for the data or the
generator function should be defined by the listener mod's API
documentation.  In general, generator should be used to make and return data.

These methods may be called at any time, during the
`registerResourceGenerators` phase or later.  If listeners are already
registered for a key when adding a resource, then the listeners'
(asynchonous) callbacks are called directly by these two methods.
The promise returned by `addResourceData()` or `addResourceGenerator()`
is resolved when all currently active listeners have finished handling
the new resource.

If a listener is added after a resource is added, then the listener will
still receive the resource.  As a result, it is not an error to
add resources with a key without any listener.

[Producer Example](https://github.com/ac2pic/emilie/blob/master/main.js#L6-L14)

### Listeners

`UtilityResourceManager` defines two methods for listeners:

```
UtilityResourceManager.addResourceListener(key: string, callback: (Resource) -> Promise<void>) -> Promise<void>
UtilityResourceManager.removeResourceListener(key: string, callback: (Resource) -> Promise<void>) -> void
```

`addResourceListener()` adds the given listener callback to receive resources
tagged with the given key. `removeResourceListener()` removes it.

The callback may be called with `{type: 'raw', data: any}` (for resources
added with `addResourceData()` or `{type: 'generator', data: AsyncFunction}`
for resources added with `addResourceGenerator()`.  In any case, this mod always
wait for the completion of any `Promise` returned by listener callbacks.

If resources were added before calling `addResourceListener()`, then
`addResourceListener()` will call your callback for each of them before resolving
the returned `Promise`.

It is recommended but not required to add resource listeners during the
`registerResourceListeners` phase.

If a resource listener callback is added more than once, it will receive
resources more than once. But `removeResourceListener()` will remove all occurence
of them.

[Listener Example](https://github.com/CCDirectLink/cc-custom-character-toolkit/blob/master/main.js#L8-L17)

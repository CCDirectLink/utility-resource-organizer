# utility-resource-organizer
Placeholder name until I can think of a better one.


## How to use

There should be either `registerResourceListener` and/or `registerResourceGenerator` as a method in your exported main class.

### registerResourceListener

This method should host the code that will do something when a generator (a function that makes and returns data) is added.

[Example](https://github.com/CCDirectLink/cc-custom-character-toolkit/blob/master/cc-custom-character-toolkit/main.js#L8-L17)

### registerResourceGenerator

This method should contain the code of all generators for a mod.

[Example](https://github.com/CCDirectLink/emilie/blob/master/emilie/main.js#L6-L14)

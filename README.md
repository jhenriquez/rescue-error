# rescue-error

When dealing with operations with multiple scenarios for error, one often needs to do some checking on the result
error before taking action. Usually one takes different actions based on these checks.

**rescue-error** tries to simplify this branching process through a cohesive fluent API.

### Basic Usage

```
const Rescue = require('rescue').Rescue;


// Something went wrong and we have an Error (or a subtype of it)
//
// err => 'Some error message.';

new Rescue(err)
        .ifAttribute('somePropertyName', _ => 'Do something about this error if it has the given property and it\'s truthy.')
        .ifMessage(/message/, _ => 'Do something about this error.')
        .default(_ => 'Do this in case none of the rules matches.')
        .do(); // Attempts to apply the rules.

```

### Remarks about the do() operation

The `do` operation marks the end of configurations and performs the checks on the different rules and applies the matched predicate, if any.
Some important points to consider about this are:

* It will throw an Error itself if none of the provided rules matched and there was not a default rule to fall back to.

* It will execute ONLY ONE of the branches, even though if multiple ones apply. In this case the first one that satifies
its condition.

### Basic Rules Available

**ifAttribute**

Executes the provided predicate function if the designed `attribute` name exists on the `Error` object and holds a truthy value.

**ifMessage**

Executes the provded predicate function if `message` attribute of the `Error` tests positive against the given Regular Expression.

**ifType**

Executes the provided prediate function if the `Error` in context is an `instance of` the designed type.

**default**

Designates a predicate to fall to if none of the attempted rules applies. The order in which this is called with regards to other
rules is not relevant.
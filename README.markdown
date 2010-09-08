
# Stately, a Javascript State Machine

State machines are awesome, and are handy for modeling many real-world problems. If you're not sure what they do, then let me direct you to [the lamson's project awesome introduction to state machines](http://lamsonproject.org/docs/introduction_to_finite_state_machines.html).  Once you've read that, come back here to see how to apply that knowledge to Stately.

I've attempted to write the library in an engine-neutral style. [vows](http://vowsjs.org) tests are included, which require [node.js](http://nodejs.org) to execute, but `stately.js` should be runnable in the browser as well.



# Usage

Call `Stately.machine` with an object whose keys are the names of the different states modeled by the state machine.  `ALL CAPS` is the convention that I use, and it ensures that the state names don't clash with the event names.

State machines start in the NEW state.  `Stately.machine` does modify the object passed in, but it's safe to call multiple times to generate multiple state machines.

Here's the raw syntax for setting up the machine:

    var machine = Stately.machine({
        NEW: {
            confirm: function () {
                // TODO: add your logic here
                return this.WATCHING;
            }
        },
        WATCHING: {
            check: function () {
                // TODO: add your logic here
                return this.CHECKING;
            },
            deactivate: function () {
                // TODO: add your logic here
                return this.SLEEPING;
            },
        },
        CHECKING: {
            response_ok: function () {
                // TODO: add your logic here
                return this.WATCHING;
            },
            response_error: function () {
                // TODO: add your logic here
                return this.WATCHING;
            },
            response_timeout: function () {
                // TODO: add your logic here
                return this.WATCHING;
            },
            response_too_many_errors: function () {
                // TODO: add your logic here
                return this.SLEEPING;
            },
        },
        SLEEPING: {
        });

Once it's running, use it as follows:

       machine.confirm()  // Transitions from NEW to WATCHING
       machine.check() // Transitions from WATCHING to CHECKING
       machine.response_ok() // Transitions from CHECKING to WATCHING
       machine.deactivate() // Transitions from WATCHING to SLEEPING



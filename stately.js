
/**
 * Constructor for the Stately state machine class.
 */
Stately = function (states) {
    this.ERROR = {is_state: true, name: "ERROR"}

    for (var state_name in states) {
        if (this[state_name])
            this.error("State already exists in this state machine: " + state);

        var state = this[state_name] = states[state_name];
        state.is_state = true;
        state.name = state_name;

        for (var event_name in state) {
            if (this[event_name])
                this.error("Event already exists in this state machine: " + this[event_name]);

            var event = this[event_name] = this.transition(state[event_name], event_name, state);
            event.is_event = true;
            event.name = event_name;
        }
    }

    this.state = this.NEW;
}

/**
 * Decorator function that checks if this state machine is in the required state to run an event;
 * if so, it runs the passed function and transitions to the next state according to its return value.
 * If the current state doesn't handle that event, or if the passed function returns a state not in this
 * state machine, the decorated function calls Stately.error() with the error and sets this state
 * machine's state to ERROR.
 */
Stately.prototype.transition = function (fun, event_name, state) {
    return function () {
        if (this.state == state) {
            var next_state = fun.apply(this, arguments);

            if (!next_state || !next_state.name || !next_state.name in this || !this[next_state.name].is_state) {
                return this.error("Transitioned into invalid state.")
            }

            this.state = next_state;
        }
    }
}

Stately.prototype.error = function (message) {
    this.state = this.ERROR;
    this.error_message = message;
}

Stately.machine = function (states) {
    return new Stately(states);
}

if (exports) exports.Stately = Stately;

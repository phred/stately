var vows = require("vows"),
    assert = require("assert"),
    sys = require("sys"),
    stately = require("./stately");

vows.describe("Stately test suite").addBatch({
    "when I make a new state machine": {
        topic: function () {
            return stately.Stately.machine({
                NEW: {
                    confirm: function () {
                        return this.WATCHING;
                    }
                },
                WATCHING: {
                    check: function () {
                        return this.CHECKING;
                    },
                    deactivate: function () {
                        return this.SLEEPING;
                    },
                    evil: function () {
                        return "BADNESS";
                    }
                },
                CHECKING: {
                    response_ok: function () {
                        return this.WATCHING;
                    },
                    response_error: function () {
                        return this.WATCHING;
                    },
                    response_timeout: function () {
                        return this.WATCHING;
                    },
                    response_too_many_errors: function () {
                        return this.SLEEPING;
                    },
                },
                SLEEPING: {
                }
            });
        },
        "it's not null": function (topic) {
            assert.notEqual(topic, null);
        },
        "it starts in the NEW state": function (topic) {
            assert.notEqual(topic.state, null, "the state is null");
            assert.equal(topic.state, topic.NEW, "the state is not NEW");
        },
        "it has states for each of the states I passed in": function (topic) {
            var states = ["WATCHING", "CHECKING", "SLEEPING"];

            for (var ndx in states) {
                assert.notEqual(topic[states[ndx]], null, "Expected state " + ndx + " but it wasn't there.");
                assert.equal(topic[states[ndx]].is_state, true, "Expected is_state set to true on " + ndx + " but it wasn't.");
            }
        },
        "it has an error state": function (topic) {
            assert.notEqual(topic.ERROR, null);
            assert.equal(topic.ERROR.is_state, true);
        },
        "I can walk through the different states": function (topic) {
            topic.confirm();
            assert.equal(topic.state, topic.WATCHING, "Expected state WATCHING, got " + topic.state.name + " error message: " + topic.error_message);

            topic.check();
            assert.equal(topic.state, topic.CHECKING);
            
            topic.response_ok();
            assert.equal(topic.state, topic.WATCHING);

            topic.deactivate();
            assert.equal(topic.state, topic.SLEEPING);

            topic.state = topic.NEW;
        },
        "I can't use an event that returns an invalid state": function (topic) {
            topic.confirm();
            assert.equal(topic.state, topic.WATCHING, "Expected state WATCHING, got " + topic.state.name + " error message: " + topic.error_message);

            topic.evil();
            assert.equal(topic.state, topic.ERROR);

            topic.state = topic.NEW;
        },
        "calling events from a different state doesn't change the current state": function (topic) {
            assert.equal(topic.state, topic.NEW);
            topic.deactivate();

            assert.equal(topic.state, topic.NEW);

            topic.confirm();
            assert.equal(topic.state, topic.WATCHING);

            topic.confirm();
            assert.equal(topic.state, topic.WATCHING);
        }
    },
}).export(module);

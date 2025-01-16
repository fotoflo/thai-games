import { createMachine } from "xstate";

export const toggleMachine = createMachine({
  initial: "OFF",
  states: {
    OFF: {
      on: {
        toggle: {
          target: "ON",
        },
      },
    },
    ON: {
      on: {
        toggle: {
          target: "OFF",
        },
      },
    },
  },
});

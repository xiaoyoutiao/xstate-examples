import { createMachine, assign, send } from 'xstate'

export { assign }

export interface GameContext {
  time: number | null
  score: number
  guessTime: number
}

export const gameMachine = createMachine<GameContext>(
  {
    id: 'game',
    initial: 'initializing',
    context: {
      time: null,
      score: 0,
      guessTime: 0
    },
    states: {
      initializing: {
        invoke: {
          id: 'getTime',
          src: async () => Math.floor(Math.random() * 3),
          onDone: {
            target: 'initialized',
            actions: assign({ time: (ctx, evt) => evt.data })
          }
        }
      },
      initialized: {
        on: {
          '': [
            { target: 'ready', cond: 'canPlay' },
            { target: 'disabled', cond: 'notPlayableTime' }
          ]
        }
      },
      ready: {
        on: {
          TOGGLE: {
            target: 'playing',
            actions: assign({
              time: (ctx) => (ctx.time as number) - 1,
              guessTime: 5
            })
          }
        }
      },
      playing: {
        always: [
          {
            target: 'ended',
            cond: (ctx) => !ctx.guessTime
          }
        ],
        on: {
          GUESS: {
            cond: (ctx) => ctx.guessTime > 0,
            actions: assign({
              score: (ctx) => ctx.score + Math.floor(Math.random() * 20),
              guessTime: (ctx) => ctx.guessTime - 1
            })
          }
        }
      },
      ended: {
        initial: 'processing',
        states: {
          processing: {
            always: [
              {
                target: 'win',
                cond: (context) => context.score > 50
              },
              {
                target: 'lose'
              }
            ]
          },
          win: {},
          lose: {}
        },
        on: {
          CONTINUE: {
            target: 'ready',
            cond: (ctx) => !!ctx.time
          }
        }
      },
      disabled: {
        type: 'final'
      }
    }
  },
  {
    guards: {
      notPlayableTime: (ctx, evt) => {
        console.log('notPlayableTime :>> ', ctx)
        console.log('evt :>> ', evt)
        return !ctx.time
      },
      canPlay: (ctx, evt) => {
        console.log('canPlay :>> ', ctx)
        console.log('evt :>> ', evt)
        return !!ctx.time
      }
    },
    actions: {
      checkScore: (context) => send(context.score >= 50 ? 'TO_WIN' : 'TO_LOSE')
    }
  }
)

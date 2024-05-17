//const process = require('node:process');
const yargs = require('yargs');
const { v4 } = require('uuid');

const {
  SubscriptionsSellerBot,
  dictionary,
} = require('@bot-store/api-bot-subscription-seller-contract');

yargs
  .scriptName('nx run api-bot-subscription-seller-contract:cli')
  .usage('$0 <cmd> [args]')
  .help()
  .strictCommands()
  .demandCommand(1)
  .option('t', {
    alias: 'token',
    describe: 'Combined token for telegram: <ID>:<HASH>.',
    type: 'string',
    demandOption: true,
  })
  .option('e', {
    alias: 'test-env',
    describe: 'Starts bot in test environment',
    type: 'boolean',
    demandOption: false,
  })
  .option('p', {
    alias: 'payment-token',
    describe: 'Required token for payment form',
    type: 'string',
    demandOption: true,
  })
  .command(
    'run-standalone',
    [
      'Runs SubscriptionsSellerBot as a standalone bot',
      'without wrapping to server or bot controller',
    ].join(' '),
    async ({ argv: { paymentToken, testEnv, token } }) => {
      const emptyFunction = () => {};
      const subscriptionsSeller = new SubscriptionsSellerBot({
        initialisingData: {
          paymentToken,
          testEnv: !!testEnv,
          token,
          uuid: v4(),
          workerType: 'paid-subscription-seller',
        },
        hooks: {
          send: emptyFunction,
          registerHandler: emptyFunction,
          close: emptyFunction,
        },
        messageTemplateDictionary: dictionary,
      });

      const terminate = async () => await subscriptionsSeller.terminate();

      process.once('SIGINT', terminate);
      process.once('SIGTERM', terminate);
    },
  )
  .fail((msg, err, yargs) => {
    if (!err && !msg) {
      console.log(yargs.help());
      process.exit(1);
    }

    if (msg) {
      console.log(msg);
    }

    if (err) {
      console.log(err);
    }

    process.exit(1);
  })
  .argv;

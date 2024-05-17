import { WidgetMetaWithLabel } from '../widget-meta-with-label';

export const dynamicFormFields: WidgetMetaWithLabel[] = [
  {
    name: 'publicName',
    label: 'Public Name',
    hint: `
Your bot will introduce itself using specified name
`,
    extendedProps: {
      placeholder: 'e.g. Exclusive News Channel',
    },
    type: 'text',
  },
  {
    name: 'publicToken',
    label: 'Public token',
    hint: `
We need a token to have an ability to control your bots.

See [how to get a token](http://botstore.online/).

You always can withdraw the permission by changing the bot token,
if you don't believe in us anymore.
`,
    extendedProps: {
      placeholder: 'e.g. 6632227800:ABHOB-dD0SUQZ1fq5wyyDOGseihrqDDCDec',
    },
    type: 'text',
  },
  {
    name: 'privateChannelID',
    label: 'Private Channel ID',
    hint: `
An easy way to obtain ID of your private channel is to copy
a link to any message in your channel. You can just put the
link here (it should look like \`https://t.me/c/1907156467/4\`).

[Click](http://botstore.online/) here to explore how to copy link of your message.
`,
    extendedProps: {
      placeholder: 'e.g. 1907156467 or https://t.me/c/1907156467/4',
    },
    type: 'text',
  },
  {
    name: 'paymentToken',
    label: 'Payment Token',
    hint: `
We use your token to charge the payment from your customers.
See&nbsp;[how to get a payment token](http://botstore.online/).
`,
    extendedProps: {
      placeholder: 'e.g. 288760674:TEST:12616',
    },
    type: 'text',
  },
  {
    name: 'welcomeText',
    label: 'Welcome Text',
    extendedProps: {
      placeholder: 'User will receive this message at first interaction',
    },
    type: 'textarea',
  },
  {
    name: 'aboutText',
    label: 'About Text',
    extendedProps: {
      placeholder: 'Detailed information about services you provide',
    },
    type: 'textarea',
  },
  {
    name: 'successfulPaymentNotification',
    label: 'Successful Payment Notification',
    extendedProps: {
      placeholder: 'Message for user in case of successful payment',
    },
    type: 'textarea',
  },
  {
    name: 'failedPaymentNotification',
    label: 'Failed Payment Notification',
    extendedProps: {
      placeholder: 'Message for user in case of failed payment',
    },
    type: 'textarea',
  },
];

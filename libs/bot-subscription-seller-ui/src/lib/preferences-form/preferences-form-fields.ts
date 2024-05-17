import {
  BotSellerRelatedDataValidator,
} from '@bot-store/bot-subscription-seller-contract';
import type { WidgetMetaWithLabel } from '@bot-store/ui-dynamic-form';
import BadgeIcon from '@mui/icons-material/Badge';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import PasswordIcon from '@mui/icons-material/Password';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { JSXElementConstructor } from 'react';

const keyset = BotSellerRelatedDataValidator.keyof().Values;

export const groupIcons: Record<string, JSXElementConstructor<any>> = {
  'About channel': BadgeIcon,
  Credentials: PasswordIcon,
  Plans: PriceChangeIcon,
  'Notification templates': MarkUnreadChatAltIcon,
};

export const preferencesFormFields: WidgetMetaWithLabel[] = [
  {
    group: 'About channel',
    name: keyset.publicName,
    label: 'Public name of channel',
    hint: `
Your bot will introduce itself using specified name
`,
    extendedProps: {
      placeholder: 'e.g. Exclusive News Channel',
    },
    type: 'text',
  },
  {
    group: 'About channel',
    name: keyset.aboutText,
    label: 'About your channel',
    extendedProps: {
      placeholder: 'Detailed information about services you provide',
    },
    type: 'messageEditor',
  },
  {
    group: 'Plans',
    name: keyset.availablePrices,
    label: 'Available prices',
    multiInput: true,
    extendedProps: {
      placeholder: 'Message for user in case of failed payment',
    },
    type: 'subscriptionPlanMultiEditor',
  },
  {
    group: 'Credentials',
    name: keyset.publicToken,
    label: 'Public token',
    hint: `
We need a token to have an ability to control your bots.
See [how to get a token](http://botstore.online/).

**Note!** You always can withdraw the permission by changing the bot token,
if you don't believe in us anymore.
`,
    extendedProps: {
      placeholder: 'e.g. 6632227800:ABHOB-dD0SUQZ1fq5wyyDOGseihrqDDCDec',
    },
    type: 'text',
  },
  {
    group: 'Credentials',
    name: keyset.privateChannelID,
    label: 'Private channel ID',
    hint: `
ID of a channel you need to control access to.
[See instruction]() how to retrieve ID of the your private channel.

**Note!** You should grant permissions to your bot.
`,
    extendedProps: {
      placeholder: 'e.g. 1907156467 or https://t.me/c/1907156467/4',
    },
    type: 'text',
  },
  {
    group: 'Credentials',
    name: keyset.paymentToken,
    label: 'Payment token',
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
    group: 'Notification templates',
    name: keyset.welcomeText,
    label: 'Welcome text',
    extendedProps: {
      placeholder: 'User will receive this message at first interaction',
    },
    type: 'messageEditor',
    hint: `
User will get this notification at first interaction with the bot
`,
  },
  {
    group: 'Notification templates',
    name: keyset.successfulPaymentNotification,
    label: 'Successful payment notification',
    extendedProps: {
      placeholder: 'Message for user in case of successful payment',
    },
    type: 'messageEditor',
    hint: `
**Note**: this notification will also contain payment details according to used [Telegram Payment Provider]().
`,
  },
  {
    group: 'Notification templates',
    name: keyset.failedPaymentNotification,
    label: 'Failed payment notification',
    extendedProps: {
      placeholder: 'Message for user in case of failed payment',
    },
    type: 'messageEditor',
    hint: `
**Note**: this notification will also contain payment details according to used [Telegram Payment Provider]().
`,
  },
];

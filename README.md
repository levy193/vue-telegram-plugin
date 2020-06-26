<h1 align="center"><b>Vue Telegram Plugin</b></h1>
<h4 align="center">A plugin for Vue support authorize and send message in telegram</h4>
<h5 align="center">No dependencies, just <a href="https://www.npmjs.com/package/tdweb">tdweb</a>(99% size)</h5>

## Installation
```bash
# Yarn
yarn add vue-telegram-plugin

# Npm
npm install vue-telegram-plugin
```

## Usage

### Prepare tdweb library
This plugin using <a href="https://www.npmjs.com/package/tdweb">tdweb</a> (Telegram Data Libraty - TDLib in browser), so after installing you have to make all tdweb's files loadable from your server. For example you can copy all file in `vue-telegram-plugin/lib` folder into the server's `public` folder.

```bash
cp -r node_modules/vue-telegram-plugin/lib/* public/
```

### Create your Telegram Application
For using telegram API you must register an application. You could easily create application at <a href="https://my.telegram.org/apps">https://my.telegram.org/apps</a>

### Loading the plugin

```javascript
import Vue from 'vue'
import VueTelegram from 'vue-telegram-plugin'

Vue.use(VueTelgram, options)
```

#### Available options

Name                  | Data Type   | Descroption
--------------------- | ----------- | -----------
`useTestDC`           | Boolean           | If set to true, the Telegram test environment will be used instead of the production environment. Default: `true`
`logVerbosityLevel`   | Number            | The initial verbosity level for the TDLib internal logging (0-1023). Default: `1`
`jsLogVerbosityLevel` | Number            | The initial verbosity level of the JavaScript part of the code. Default: `3`
`useDatabase`         | Boolean           | Default: false. If set to true, the library will maintain a cache of users, basic groups, supergroups, channels and secret chats.
`apiId`               | String(required)  | Application identifier for Telegram API access, which can be obtained at https://my.telegram.org.
`apiHash`             | String(required)  | Application identifier hash for Telegram API access, which can be obtained at https://my.telegram.org.
`system_language_code`| String            | IETF language tag of the user's operating system language. Default `en`
`database_directory`  | String            | The path to the directory for the persistent database. Default: `/telegramdb`

#### Available methods

Methods that are register on vue `$vTelegram` instance. For first, call `init` method to initialize telegram service.

```javascript
Vue.$vTelegram.init()
```

Method                    | Params                              | Descroption
------------------------- | ----------------------------------- | -----------
`init`                    |                                     | Initialize telegram service
`login`                   | phoneNumber(String)                 | Login with phone number
`confirmVerificationCode` | verificationCode(String)            | Confirm the verification code
`getMe`                   |                                     | Get logged user information
`searchChats`             | {</br> &nbsp;&nbsp;query(String), &nbsp;&nbsp;limit(Number)</br>}    | Search chat's title match query with `limit` results
`sendMessage`             | { </br> &nbsp;&nbsp;chatId(String), &nbsp;&nbsp;message(String) </br>} | Send `message` to chat with `chatId`
`logout`                  |                                     | Logout user


#### Available events

Events that are emmited on the vue `$vTelegramBus` instance (Event Bus).

```javascript
// Listening an event.
Vue.$vTelegramBus.on(event, () => {})

// Remove one or move event.
Vue.$vTelegramBus.off(event, () => {})

// Listen for the given event once.
Vue.$vTelegramBus.once(event, () => {})

// Emit an event.
Vue.$vTelegramBus.once(event, ...args)
```

Event                               | Argurments                          | Descroption
----------------------------------- | ----------------------------------- | -----------
`authorizationStateWaitPhoneNumber` |                                     | Telegram need the user's phone number to authorize. Call `$vTelegram.login` method to provice the phone number.
`authorizationStateWaitCode`        |                                     | Telegram need the the user's authentication code to authorize. Call `$vTelegram.confirmVerificationCode` method to provice the authenticateion code.
`authorizationStateReady`           |                                     | The user has been successfully authorized. VueTelegram is now ready to use such as `$vTelegram.getMe()` ...

#### Auth component

If you don't want to create your auth component you can use `VueTelegramAuth` that registered global. This component is a dialog contain phone and verification code submit's form to authenticate user. Simple to use no parameters required. To use the component, you have to install <a href="https://element.eleme.io/#/en-US">ElementUI</a>

```javascript
<VueTelegramAuth />
```
import TdClient from 'tdweb/dist/tdweb'

import {
  WASM_FILE_HASH,
  WASM_FILE_NAME
} from './contants'

import {
  getBrowser,
  getOSName
} from './util'

class TdLibController {
  constructor() {
    this.parameters = {
      useTestDC: false,
      readOnly: false,
      verbosity: 1,
      jsVerbosity: 3,
      fastUpdating: true,
      useDatabase: false,
      mode: 'wasm'
    }

    this.streaming = false
    this.disableLog = true
  }

  init = () => {
    const {
      verbosity,
      jsVerbosity,
      useTestDC,
      readOnly,
      useDatabase,
      mode
    } = this.parameters

    let options = {
      logVerbosityLevel: verbosity,
      jsLogVerbosityLevel: jsVerbosity,
      mode: mode, // 'wasm-streaming'/'wasm'/'asmjs'
      prefix: useTestDC ? 'tdlib_test' : 'tdlib',
      readOnly: readOnly,
      isBackground: false,
      useDatabase: useDatabase,
      wasmUrl: `${WASM_FILE_NAME}?_sw-precache=${WASM_FILE_HASH}`,
      onUpdate: (update) => {
        console.log('Update: ', update)
        switch (update['@type']) {
          case 'updateAuthorizationState': {

            switch (update.authorization_state['@type']) {
              case 'authorizationStateWaitTdlibParameters':
                this.sendTdParameters()
                break
              case 'authorizationStateWaitEncryptionKey':
                this.send({ '@type': 'checkDatabaseEncryptionKey' });
                break;
            }
          }
        }
      }
    }

    this.client = new TdClient(options)
  }

  send = request => {
    if (!this.client) {
      console.error('Client is not initialized!', request)
      return;
    }

    return this.client.send(request)
  }

  sendTdParameters = async () => {
    const apiId = '1497957';
    const apiHash = '178cf1000113c595e64ab1513dc687c4';

    // console.log('[td] sendTdParameters', apiHash, apiId);
    if (!apiId || !apiHash) {
      if (
        window.confirm(
          'API id is missing!\n' +
          'In order to obtain an API id and develop your own application ' +
          'using the Telegram API please visit https://core.telegram.org/api/obtaining_api_id'
        )
      ) {
        window.location.href = 'https://core.telegram.org/api/obtaining_api_id';
      }
    }

    const { useTestDC } = this.parameters;

    this.send({
      '@type': 'setTdlibParameters',
      parameters: {
        '@type': 'tdParameters',
        use_test_dc: useTestDC,
        api_id: apiId,
        api_hash: apiHash,
        system_language_code: navigator.language || 'en',
        device_model: getBrowser(),
        system_version: getOSName(),
        use_secret_chats: false,
        use_message_database: true,
        application_version: '1.0.0',
        use_file_database: false,
        database_directory: '/db',
        files_directory: '/'
      }
    });

    if (this.parameters.tag && this.parameters.tagVerbosity) {
      for (let i = 0; i < this.parameters.tag.length; i++) {
        let tag = this.parameters.tag[i];
        let tagVerbosity = this.parameters.tagVerbosity[i]

        this.send({
          '@type': 'setLogTagVerbosityLevel',
          tag: tag,
          new_verbosity_level: tagVerbosity
        });
      }
    }
  }

  logOut() {
    this.send({ '@type': 'logOut' }).catch(error => {
        console.log('tdlib_auth_error', error);
    });
}
}

const controller = new TdLibController()

export default controller

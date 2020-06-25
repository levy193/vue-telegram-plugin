import TdClient from 'tdweb/dist/tdweb'

import {
  getBrowser,
  getOSName
} from './util'

class TdLibController {
  constructor(options) {
    this.options = Object.assign({
      useTestDC: false,
      readOnly: false,
      logVerbosityLevel: 1,
      jsLogVerbosityLevel: 3,
      fastUpdating: true,
      useDatabase: false,
      mode: 'wasm', // 'wasm-streaming'/'wasm'/'asmjs'
      wasmUrl: `a848b8b40a9281225b96b8d300a07767.wasm?_sw-precache=a848b8b40a9281225b96b8d300a07767`,
      apiId: '1497957',
      apiHash: '178cf1000113c595e64ab1513dc687c4',
      system_language_code: 'en',
      database_directory: '/telegramdb'
    }, options)

    this.disableLog = true

    this.hasInit = false
    this.isAuthenticated = false
    this.user = null
    this.chats = null
  }

  init = ({ onUpdate }) => {
    const {
      logVerbosityLevel,
      jsLogVerbosityLevel,
      useTestDC,
      readOnly,
      useDatabase,
      mode,
      wasmUrl
    } = this.options

    let options = {
      logVerbosityLevel,
      jsLogVerbosityLevel,
      mode,
      prefix: useTestDC ? 'tdlib_test' : 'tdlib',
      readOnly,
      isBackground: false,
      useDatabase,
      wasmUrl,
      onUpdate
    }

    this.client = new TdClient(options)

    this.hasInit = true
  }

  send = request => {
    if (!this.client) {
      return console.error('[VUE_TELEGRAM] Client is not initialized (Call init method first)!', request)
    }

    return this.client.send(request)
  }

  sendTdParameters = async () => {
    const apiId = this.options.apiId;
    const apiHash = this.options.apiHash;

    if (!apiId || !apiHash) {
      return console.error('[VUE_TELEGRAM] API id is missing!')
    }

    const { useTestDC } = this.options;

    this.send({
      '@type': 'setTdlibParameters',
      parameters: {
        '@type': 'tdParameters',
        use_test_dc: useTestDC,
        api_id: apiId,
        api_hash: apiHash,
        system_language_code: this.options.system_language_code || 'en',
        device_model: getBrowser(),
        system_version: getOSName(),
        use_secret_chats: false,
        use_message_database: true,
        application_version: '1.0.0',
        use_file_database: false,
        database_directory: this.options.database_directory || '/telegramdb',
        files_directory: '/'
      }
    })
  }

  logout() {
    this.send({ '@type': 'logOut' })
      .then(() => {
        this,this.isAuthenticated = false
      })
      .catch(error => {
        console.error('[VUE_TELEGRAM] Logout error: ', error);
      })
  }

  update(key, value) {
    this[key] = value
  }
}

export default TdLibController

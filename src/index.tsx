import { mount, h } from 'harmaja'
import { App } from './App'
import { appStore } from './store'

mount(<App appState={appStore()} />, document.getElementById('root')!)

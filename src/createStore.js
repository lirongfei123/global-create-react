import { createProviderAndConnect, createStore } from 'react-state-pro'
import stateConfig from './modules'
import withStyles from 'react-jss'
const state = createStore(stateConfig)
const context = createProviderAndConnect(state)
const Provider = context.Provider
const connect = (stateToProps, styles) => {
    styles = styles || {}
    return (App) => {
        return withStyles(styles)(context.connect(stateToProps)(App))
    }
}
export { Provider, connect }

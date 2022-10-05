import { createStore } from 'vuex'
import identity from './modules/identity'
import sidebar from './modules/sidebar'

export default createStore({
    modules: {
        identity,
        sidebar
    }
})

import Vue from 'vue'
import Components from './components'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faSearch,
    faBars,
    faChevronDown,
    faSpinner,
    faCheckCircle,
    faTimesCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SvgVue from 'svg-vue'

import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

Vue.use(Autocomplete)

Vue.use(SvgVue)

Vue.component('font-awesome-icon', FontAwesomeIcon)

library.add(
    faSearch,
    faBars,
    faChevronDown,
    faSpinner,
    faCheckCircle,
    faTimesCircle
)

new Vue({
    el: '#app',
    delimiters: ['${', '}']
})

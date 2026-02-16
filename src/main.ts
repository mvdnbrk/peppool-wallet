import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import '@tailwindplus/elements'
import './style.css'
import App from './App.vue'
import PepButton from './components/ui/PepButton.vue'
import PepInput from './components/ui/PepInput.vue'
import PepPasswordInput from './components/ui/PepPasswordInput.vue'
import PepHeader from './components/ui/PepHeader.vue'
import PepWordmark from './components/ui/PepWordmark.vue'
import PepMnemonicGrid from './components/ui/PepMnemonicGrid.vue'
import PepCheckbox from './components/ui/PepCheckbox.vue'
import PepIcon from './components/ui/PepIcon.vue'
import PepFooter from './components/ui/PepFooter.vue'
import PepList from './components/ui/PepList.vue'
import PepListItem from './components/ui/PepListItem.vue'
import PepCard from './components/ui/PepCard.vue'
import PepInputGroup from './components/ui/PepInputGroup.vue'
import PepSpinner from './components/ui/PepSpinner.vue'
import * as constants from './utils/constants'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.config.globalProperties.$constants = constants
app.config.globalProperties.$RIBBITS_PER_PEP = constants.RIBBITS_PER_PEP
app.component('PepButton', PepButton)
app.component('PepInput', PepInput)
app.component('PepPasswordInput', PepPasswordInput)
app.component('PepHeader', PepHeader)
app.component('PepWordmark', PepWordmark)
app.component('PepMnemonicGrid', PepMnemonicGrid)
app.component('PepCheckbox', PepCheckbox)
app.component('PepIcon', PepIcon)
app.component('PepFooter', PepFooter)
app.component('PepList', PepList)
app.component('PepListItem', PepListItem)
app.component('PepCard', PepCard)
app.component('PepInputGroup', PepInputGroup)
app.component('PepSpinner', PepSpinner)
app.mount('#app')

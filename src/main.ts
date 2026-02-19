import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/router';
import '@tailwindplus/elements';
import './style.css';
import App from './App.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepLoadingButton from '@/components/ui/PepLoadingButton.vue';
import PepInput from '@/components/ui/form/PepInput.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';
import PepPasswordFields from '@/components/ui/form/PepPasswordFields.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepGlobalHeader from '@/components/ui/PepGlobalHeader.vue';
import PepForm from '@/components/ui/form/PepForm.vue';
import PepWordmark from '@/components/ui/PepWordmark.vue';
import PepMnemonicGrid from '@/components/ui/PepMnemonicGrid.vue';
import PepCheckbox from '@/components/ui/form/PepCheckbox.vue';
import PepRadioList from '@/components/ui/form/PepRadioList.vue';
import PepIcon from '@/components/ui/PepIcon.vue';
import PepFooter from '@/components/ui/PepFooter.vue';
import PepList from '@/components/ui/list/PepList.vue';
import PepListItem from '@/components/ui/list/PepListItem.vue';
import PepCard from '@/components/ui/PepCard.vue';
import PepCopyableId from '@/components/ui/PepCopyableId.vue';
import PepInputGroup from '@/components/ui/form/PepInputGroup.vue';
import PepSpinner from '@/components/ui/PepSpinner.vue';
import PepAmountInput from '@/components/ui/form/PepAmountInput.vue';
import PepTransactionItem from '@/components/ui/list/PepTransactionItem.vue';
import * as constants from '@/utils/constants';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Expose internals for automated screenshots (DEV only — tree-shaken from production builds)
if (import.meta.env.DEV) {
  (window as any).__peppool_dev__ = { app, router, pinia };
}
app.config.globalProperties.$constants = constants;
app.config.globalProperties.$RIBBITS_PER_PEP = constants.RIBBITS_PER_PEP;
app.component('PepButton', PepButton);
app.component('PepLoadingButton', PepLoadingButton);
app.component('PepInput', PepInput);
app.component('PepPasswordInput', PepPasswordInput);
app.component('PepPasswordFields', PepPasswordFields);
app.component('PepPageHeader', PepPageHeader);
app.component('PepMainLayout', PepMainLayout);
app.component('PepGlobalHeader', PepGlobalHeader);
app.component('PepForm', PepForm);
app.component('PepWordmark', PepWordmark);
app.component('PepMnemonicGrid', PepMnemonicGrid);
app.component('PepCheckbox', PepCheckbox);
app.component('PepRadioList', PepRadioList);
app.component('PepIcon', PepIcon);
app.component('PepFooter', PepFooter);
app.component('PepList', PepList);
app.component('PepListItem', PepListItem);
app.component('PepCard', PepCard);
app.component('PepCopyableId', PepCopyableId);
app.component('PepInputGroup', PepInputGroup);
app.component('PepSpinner', PepSpinner);
app.component('PepAmountInput', PepAmountInput);
app.component('PepTransactionItem', PepTransactionItem);
app.mount('#app');

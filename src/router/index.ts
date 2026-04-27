import { createRouter, createWebHashHistory } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import WelcomeView from '@/views/onboarding/WelcomeView.vue';
import CreateWalletView from '@/views/onboarding/CreateWalletView.vue';
import ImportWalletView from '@/views/onboarding/ImportWalletView.vue';
import DashboardView from '@/views/wallet/DashboardView.vue';
import ReceiveView from '@/views/wallet/ReceiveView.vue';
import SendView from '@/views/wallet/send/SendView.vue';
import ShowMnemonicView from '@/views/settings/ShowMnemonicView.vue';
import SettingsView from '@/views/settings/SettingsView.vue';
import ChangePasswordView from '@/views/settings/ChangePasswordView.vue';
import ForgotPasswordView from '@/views/onboarding/ForgotPasswordView.vue';
import ResetWalletView from '@/views/settings/ResetWalletView.vue';
import TransactionDetailView from '@/views/wallet/TransactionDetailView.vue';
import CurrencyView from '@/views/settings/CurrencyView.vue';
import PreferredExplorerView from '@/views/settings/PreferredExplorerView.vue';
import AutoLockView from '@/views/settings/AutoLockView.vue';
import PreferencesView from '@/views/settings/PreferencesView.vue';
import SecurityView from '@/views/settings/SecurityView.vue';
import AboutView from '@/views/settings/AboutView.vue';
import AccountsView from '@/views/settings/AccountsView.vue';
import EditAccountView from '@/views/settings/EditAccountView.vue';
import ConnectedSitesView from '@/views/settings/ConnectedSitesView.vue';
import ConnectSiteView from '@/views/approval/ConnectSiteView.vue';
import SignMessageView from '@/views/approval/SignMessageView.vue';
import SignTxView from '@/views/approval/SignTxView.vue';

const routes = [
  { path: '/', component: WelcomeView },
  { path: '/create', component: CreateWalletView },
  { path: '/import', component: ImportWalletView, meta: { persist: true } },
  { path: '/dashboard', component: DashboardView },
  { path: '/receive', component: ReceiveView, meta: { persist: true } },
  { path: '/send', component: SendView, meta: { persist: true } },
  { path: '/show-mnemonic', component: ShowMnemonicView },
  { path: '/settings', component: SettingsView },
  { path: '/change-password', component: ChangePasswordView },
  { path: '/forgot-password', component: ForgotPasswordView },
  { path: '/reset-wallet', component: ResetWalletView },
  { path: '/tx/:txid', component: TransactionDetailView, meta: { persist: true } },
  { path: '/settings/preferences', component: PreferencesView },
  { path: '/settings/security', component: SecurityView },
  { path: '/settings/about', component: AboutView },
  { path: '/settings/accounts', component: AccountsView },
  { path: '/settings/accounts/edit/:index', component: EditAccountView },
  { path: '/settings/connected-sites', component: ConnectedSitesView },
  { path: '/settings/currency', component: CurrencyView },
  { path: '/settings/explorer', component: PreferredExplorerView },
  { path: '/settings/auto-lock', component: AutoLockView },
  { path: '/approve/connect', component: ConnectSiteView },
  { path: '/approve/sign-message', component: SignMessageView },
  { path: '/approve/sign-tx', component: SignTxView },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export let sessionChecked = false;
/** Route to redirect to after unlock (e.g. approval routes when wallet was locked) */
export let pendingRedirect: string | null = null;

export function resetSessionCheck() {
  sessionChecked = false;
}

export function consumePendingRedirect(): string | null {
  const route = pendingRedirect;
  pendingRedirect = null;
  return route;
}

router.beforeEach(async (to, _from, next) => {
  const walletStore = useWalletStore();

  if (!sessionChecked) {
    await walletStore.checkSession();
    sessionChecked = true;

    // Auto-restore last route
    const data = await chrome.storage.session.get('last_route');
    const savedRoute = data.last_route as string | undefined;
    if (savedRoute && to.path === '/') {
      const resolved = router.resolve(savedRoute);
      const isPersistent = resolved.matched.length > 0 && resolved.meta.persist;

      // Public routes that don't require an unlocked wallet
      const publicRoutes = ['/', '/create', '/import', '/forgot-password'];
      const isPublic = publicRoutes.includes(resolved.path);

      if (isPersistent && (walletStore.isUnlocked || isPublic)) {
        return next(savedRoute);
      }
      await chrome.storage.session.remove('last_route');
    }
  }

  // Public routes that don't require an unlocked wallet
  const publicRoutes = ['/', '/create', '/import', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(to.path);

  if (!walletStore.isUnlocked && !isPublicRoute) {
    // Save the intended route so we can redirect after unlock
    if (to.path.startsWith('/approve/')) {
      pendingRedirect = to.fullPath;
    }
    next('/');
  } else if (to.path === '/' && walletStore.isUnlocked) {
    next('/dashboard');
  } else {
    next();
  }
});

// Save route after each navigation ONLY if persist is true
router.afterEach(async (to) => {
  if (to.meta.persist) {
    await chrome.storage.session.set({ last_route: to.path });
  } else {
    // If we navigate to a non-persistent page (like Settings or Dashboard),
    // clear the last route so we default back to Dashboard next time.
    await chrome.storage.session.remove('last_route');
  }
});

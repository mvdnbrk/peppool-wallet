import { createRouter, createWebHashHistory } from 'vue-router';
import { useWalletStore } from '../stores/wallet';
import WelcomeView from '../views/WelcomeView.vue';
import CreateWalletView from '../views/CreateWalletView.vue';
import ImportWalletView from '../views/ImportWalletView.vue';
import DashboardView from '../views/DashboardView.vue';
import ReceiveView from '../views/ReceiveView.vue';
import SendView from '../views/SendView.vue';
import ShowMnemonicView from '../views/ShowMnemonicView.vue';
import SettingsView from '../views/SettingsView.vue';
import ChangePasswordView from '../views/ChangePasswordView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import ResetWalletView from '../views/ResetWalletView.vue';
import TransactionDetailView from '../views/TransactionDetailView.vue';
import CurrencyView from '../views/CurrencyView.vue';
import PreferredExplorerView from '../views/PreferredExplorerView.vue';
import AutoLockView from '../views/AutoLockView.vue';
import PreferencesView from '../views/PreferencesView.vue';
import SecurityView from '../views/SecurityView.vue';
import AboutView from '../views/AboutView.vue';

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
    { path: '/settings/currency', component: CurrencyView },
    { path: '/settings/explorer', component: PreferredExplorerView },
    { path: '/settings/auto-lock', component: AutoLockView },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

let sessionChecked = false;

router.beforeEach(async (to, _from, next) => {
    const walletStore = useWalletStore();

    if (!sessionChecked) {
        await walletStore.checkSession();
        sessionChecked = true;

        // Auto-restore last route
        const savedRoute = localStorage.getItem('peppool_last_route');
        if (savedRoute && to.path === '/') {
            const resolved = router.resolve(savedRoute);
            const isPersistent = resolved.matched.length > 0 && resolved.meta.persist;
            
            // Public routes that don't require an unlocked wallet
            const publicRoutes = ['/', '/create', '/import', '/forgot-password'];
            const isPublic = publicRoutes.includes(resolved.path);

            if (isPersistent && (walletStore.isUnlocked || isPublic)) {
                return next(savedRoute);
            }
            localStorage.removeItem('peppool_last_route');
        }
    }

    // Public routes that don't require an unlocked wallet
    const publicRoutes = ['/', '/create', '/import', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(to.path);

    if (!walletStore.isUnlocked && !isPublicRoute) {
        // Redirect any protected route to welcome/login when locked
        next('/');
    } else if (to.path === '/' && walletStore.isUnlocked) {
        next('/dashboard');
    } else {
        next();
    }
});

// Save route after each navigation ONLY if persist is true
router.afterEach((to) => {
    if (to.meta.persist) {
        localStorage.setItem('peppool_last_route', to.path);
    } else {
        // If we navigate to a non-persistent page (like Settings or Dashboard),
        // clear the last route so we default back to Dashboard next time.
        localStorage.removeItem('peppool_last_route');
    }
});

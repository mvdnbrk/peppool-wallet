import { computed } from 'vue';
import { useApp } from './useApp';

const HIDDEN_PATHS = ['/', '/create', '/import', '/reset-wallet', '/forgot-password'];

export function useGlobalHeader() {
  const { route } = useApp();

  const isVisible = computed(
    () => !HIDDEN_PATHS.includes(route.path) && !route.path.startsWith('/approve/')
  );

  return { isVisible };
}

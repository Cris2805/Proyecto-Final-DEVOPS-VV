import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { getSettings } from './services/settingsService.js';
import { applyStoredTheme, applyTheme } from './services/themeService.js';

export default function App() {
  useEffect(() => {
    applyStoredTheme();
    getSettings()
      .then((settings) => applyTheme(settings.theme || 'dark', settings.primary_color || 'blue-violet'))
      .catch(() => {});
  }, []);

  return <AppRoutes />;
}

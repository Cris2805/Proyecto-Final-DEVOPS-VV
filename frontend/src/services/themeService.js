export function applyTheme(theme = 'dark', accent = 'blue-violet') {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-accent', accent);
  localStorage.setItem('taskflow_theme', theme);
  localStorage.setItem('taskflow_accent', accent);
}

export function applyStoredTheme() {
  const theme = localStorage.getItem('taskflow_theme') || 'dark';
  const accent = localStorage.getItem('taskflow_accent') || 'blue-violet';
  applyTheme(theme, accent);
}

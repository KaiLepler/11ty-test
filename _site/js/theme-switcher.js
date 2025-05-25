(function() {
  const themeCheckbox = document.getElementById('theme-checkbox');
  const htmlElement = document.documentElement;

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    if (themeCheckbox) {
      themeCheckbox.checked = (theme === 'light');
    }
    // Set cookie to remember the theme, expires in 1 year
    document.cookie = "theme=" + theme + ";path=/;max-age=31536000;samesite=lax";
  }

  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', function() {
      if (this.checked) {
        applyTheme('light');
      } else {
        applyTheme('dark');
      }
    });
  }

  // Initial theme load
  function loadInitialTheme() {
    let preferredTheme = 'dark'; // Default to dark theme

    // Check for saved theme in cookie
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'theme' && (value === 'light' || value === 'dark')) {
        preferredTheme = value;
        break;
      }
    }
    applyTheme(preferredTheme);
  }

  // Apply theme as soon as the DOM is somewhat ready or fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInitialTheme);
  } else {
    loadInitialTheme();
  }

})();

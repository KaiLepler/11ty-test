(function () {
  const themeButton = document.getElementById('theme-button');
  const htmlElement = document.documentElement;

  // Three modes: 'light', 'dark', 'auto' (follow system)
  const MODES = ['auto', 'light', 'dark'];
  let currentMode = 'auto'; // Default to auto

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getEffectiveTheme(mode) {
    if (mode === 'auto') {
      return getSystemPreference();
    }
    return mode;
  }

  function updateIcon() {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const autoIcon = document.querySelector('.auto-icon');

    if (!sunIcon || !moonIcon || !autoIcon) return;

    // Hide all icons first
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'none';
    autoIcon.style.display = 'none';

    // Show the appropriate icon based on current mode
    if (currentMode === 'light') {
      sunIcon.style.display = 'block';
    } else if (currentMode === 'dark') {
      moonIcon.style.display = 'block';
    } else {
      autoIcon.style.display = 'block';
    }
  }

  function applyTheme(mode) {
    currentMode = mode;
    const effectiveTheme = getEffectiveTheme(mode);
    htmlElement.setAttribute('data-theme', effectiveTheme);
    htmlElement.setAttribute('data-theme-mode', mode);
    updateIcon();

    // Set cookie to remember the mode preference, expires in 1 year
    document.cookie = "theme-mode=" + mode + ";path=/;max-age=31536000;samesite=lax";
  }

  function cycleTheme() {
    const currentIndex = MODES.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % MODES.length;
    const nextMode = MODES[nextIndex];
    applyTheme(nextMode);
  }

  if (themeButton) {
    themeButton.addEventListener('click', cycleTheme);
  }

  // Initial theme load
  function loadInitialTheme() {
    let preferredMode = 'auto'; // Default to auto (follow system)

    // Check for saved theme mode in cookie
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'theme-mode' && MODES.includes(value)) {
        preferredMode = value;
        break;
      }
    }
    applyTheme(preferredMode);
  }

  // Listen for system theme changes when in auto mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (currentMode === 'auto') {
      applyTheme('auto');
    }
  });

  // Apply theme as soon as the DOM is somewhat ready or fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInitialTheme);
  } else {
    loadInitialTheme();
  }

})();

jtd.switchThemeButton = function(button, event) {
    const themes = ["auto", "light", "dark"];
    var currentTheme = jtd.getTheme();
    var nextTheme = themes[(themes.indexOf(currentTheme)+1)%themes.length];
    jtd.setTheme(nextTheme);
    button.getElementsByTagName('svg')[0].getElementsByTagName('use')[0].setAttribute('href',`#svg-${nextTheme}`);
    window.localStorage.setItem('theme', nextTheme);
}

jtd.onReady(() => {
    theme = window.localStorage.getItem('theme');
    if(theme == null) return;
    jtd.setTheme(theme);
    var buttons = [...document.getElementsByClassName("color-scheme-switch-theme-button")];
    buttons.forEach(button => button.getElementsByTagName('svg')[0].getElementsByTagName('use')[0].setAttribute('href',`#svg-${theme}`));
});
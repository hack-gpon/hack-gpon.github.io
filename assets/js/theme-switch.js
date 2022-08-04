
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    jtd.setTheme('dark'); 
} else {
    jtd.setTheme('light'); 
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? "dark" : "light";
    jtd.setTheme(newColorScheme);
});


const toggleDarkMode = document.querySelector('.js-toggle-dark-mode'); 
jtd.addEvent(toggleDarkMode, 'click', function(){ 
    if (jtd.getTheme() === 'dark') { 
        jtd.setTheme('light'); 
        toggleDarkMode.textContent = 'Preview dark color scheme'; 
    } else { jtd.setTheme('dark'); 
    toggleDarkMode.textContent = 'Return to the light side'; } 
});
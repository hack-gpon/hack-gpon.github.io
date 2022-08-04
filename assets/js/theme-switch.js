if(localStorage.getItem("color-scheme") === null) {
    const newColorScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    const newTextScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "Light mode" : "Dark mode";
    jtd.setTheme(newColorScheme);
    localStorage.setItem("color-scheme",newColorScheme);
    localStorage.setItem("text-scheme",newTextScheme);
    window.addEventListener('load', function () {
        toggleDarkMode.textContent = newTextScheme; 
    });
} else {
    jtd.setTheme(localStorage.getItem("color-scheme"));
    window.addEventListener('load', function () {
        toggleDarkMode.textContent = localStorage.getItem("text-scheme"); 
    });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if(localStorage.getItem("color-scheme") === null) {
        const newColorScheme = event.matches ? "dark" : "light";
        const newTextScheme = event.matches ? "Light mode" : "Dark mode";
        jtd.setTheme(newColorScheme);
        toggleDarkMode.textContent = newTextScheme; 
        localStorage.setItem("color-scheme",newColorScheme);
        localStorage.setItem("text-scheme",newTextScheme);
    }
});


const toggleDarkMode = document.querySelector('.js-toggle-dark-mode'); 
jtd.addEvent(toggleDarkMode, 'click', function(){ 
    const newColorScheme = jtd.getTheme() !== 'dark' ? "dark" : "light";
    const newTextScheme = jtd.getTheme() !== 'dark' ? "Light mode" : "Dark mode";
    jtd.setTheme(newColorScheme);
    toggleDarkMode.textContent = newTextScheme; 
    localStorage.setItem("color-scheme",newColorScheme);
    localStorage.setItem("text-scheme",newTextScheme);
});
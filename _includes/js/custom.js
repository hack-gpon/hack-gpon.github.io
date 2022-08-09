
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
    jtd.onReady(function () {
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

jtd.onReady(function(){
    var modals = document.querySelectorAll("[data-modal]");
    var modalToogles = document.querySelectorAll("[data-toogle=modal]");
    
    
    [...modals].forEach(modal => {
        var closeBtns = modal.getElementsByClassName("close");
        [...closeBtns].forEach(closeBtn => {
            closeBtn.addEventListener("click", (event) => {
                modal.style.display = "none";
            });
        })
    });
    
    [...modalToogles].forEach(toogle => {
        toogle.addEventListener("click", (event) => {
            var modal = document.querySelector(toogle.getAttribute('data-target'));
            modal.style.display = "block";
        });
    });
    
    window.addEventListener("click", function(event) {
        if ([...modals].includes(event.target)) {
            event.target.style.display = "none";
        }
    });
    
    
});
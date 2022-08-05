var modals = document.querySelectorAll("div[data-modal]");
var modalToogles = document.querySelectorAll("div[data-toogle=modal]");


[...modals].forEach(modal => {
    var closeBtns = modal.getElementsByClassName("close");
    [...closeBtns].forEach(closeBtn => {
        closeBtn.addEventListener("click", (event) => {
            modal.style.display = "none";
        });
    })
});

[...modalToogles].forEach(toogle => {
    var modal = document.querySelector(toogle.getAttribute('data-target'));
    modal.style.display = "block";
});

window.addEventListener("click", function(event) {
    if ([...modals].includes(event.target)) {
        event.target.style.display = "none";
    }
});


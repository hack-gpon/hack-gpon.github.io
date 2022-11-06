var modals = document.querySelectorAll("[data-modal]");
var modalToogles = document.querySelectorAll("[data-toogle=modal]");
const modalOpen = new Event('modal-open');
const modalClose = new Event('modal-close');

[...modals].forEach(modal => {
    var closeBtns = modal.getElementsByClassName("close");
    [...closeBtns].forEach(closeBtn => {
        closeBtn.addEventListener("click", (event) => {
            modal.style.display = "none";
            modal.dispatchEvent(modalClose);
        });
    })
});

[...modalToogles].forEach(toogle => {
    toogle.addEventListener("click", (event) => {
        var modal = document.querySelector(toogle.getAttribute('data-target'));
        modal.style.display = "block";
        modal.dispatchEvent(modalOpen);
    });
});

window.addEventListener("click", function(event) {
    if ([...modals].filter(modal => modal.getAttribute("data-modal-backdrop") !== "static").includes(event.target)) {
        event.target.dispatchEvent(modalClose);
        event.target.style.display = "none";
    }
});


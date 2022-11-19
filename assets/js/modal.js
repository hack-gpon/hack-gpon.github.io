var modals = document.querySelectorAll("[data-modal]");
var modalToogles = document.querySelectorAll("[data-toogle=modal]");

[...modals].forEach(modal => {
    var closeBtns = modal.getElementsByClassName("close");
    [...closeBtns].forEach(closeBtn => {
        closeBtn.addEventListener("click", (event) => {
            modal.style.display = "none";
            modal.dispatchEvent( new Event('modal-close'));
            console.log(modal);
                });
    })
});

[...modalToogles].forEach(toogle => {
    toogle.addEventListener("click", (event) => {
        var modal = document.querySelector(toogle.getAttribute('data-target'));
        modal.style.display = "block";
        modal.dispatchEvent(new Event('modal-open'));
        console.log(modal);
    });
});

window.addEventListener("click", function(event) {
    if ([...modals].filter(modal => modal.getAttribute("data-modal-backdrop") !== "static").includes(event.target)) {
        event.target.dispatchEvent( new Event('modal-close'));
        event.target.style.display = "none";
        console.log(event.target);
    }
});


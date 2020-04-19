const toastElm = document.getElementById("snackbar");
const timOut = 3000
const toast = {
    success: (msg) => {
        toastElm.className = "show bg-primary";
        toastElm.innerHTML = msg
        setTimeout(()=>{
            toastElm.className = toastElm.className.replace("show", "");
        }, timOut);
    },
    error: (msg) => {
        toastElm.className = "show bg-danger";
        toastElm.innerHTML = msg
        setTimeout(()=>{
            toastElm.className = toastElm.className.replace("show", "");
        }, timOut);
    }
}
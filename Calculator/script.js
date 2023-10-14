const input = document.querySelectorAll("input");
const checkbox = document.getElementById("switch");
const display = document.getElementById("display");
var value = "";
checkbox.addEventListener("click", () => {
    if (checkbox.checked) {
        document.body.setAttribute("data-theme", "dark")
    } else {
        document.body.setAttribute("data-theme", "")
    }
})
input.forEach((e) => {
    e.addEventListener("click", (event) => {
        if (event.target.value == "=") {
            if (value.length != 0) {
                neval = eval(value)
                display.value = neval;
                display.scrollLeft += 1000;
                value = neval;
            }
        } else if (event.target.value == "C") {
            display.value = value.substr(0, value.length - 1);
            value = value.substr(0, value.length - 1);
        } else if (event.target.value == "switch") {

        } else {
            value += event.target.value;
            display.value = value;
            display.scrollLeft += 1000;
        }


    });
});
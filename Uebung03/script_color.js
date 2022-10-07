function changestyle() {
    var text = document.querySelector("#ausgabe");
    var eingabe = document.querySelector("#src");

    var random = Math.floor(Math.random()*16777215).toString(16);

    var farbe = "#" + random;

    text.style["color"] = farbe;
    text.style["font-size"] = "50px";
    text.style["padding"] = "32px 32px";
    text.style["text-algin"] = "center";
    text.style["font-family"] = "arial";

    var wert_feld = eingabe.value;
    text.setAttribute("value", wert_feld);

}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var d = today.getDate();
    var mo = today.getMonth();
    var y = today.getFullYear();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML = h + ":" + m + ":" + s;
    document.getElementById('date').innerHTML = d + "." + mo + "." + y;
    var t = setTimeout(startTime,500);
}   
 
 
 
    function checkTime(i) {
  if (i < 10) {i = "0" + i}; 
  return i;
}
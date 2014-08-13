var host = window.location.host;
var pathname = window.location.pathname;
if (host == "zininworks.com"){
    pathname = pathname.replace('/syncscoreco', '');
    window.location.replace("http://syncscore.co" + pathname);
}
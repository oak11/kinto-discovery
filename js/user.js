function authenticate(){
    var storageServer = "https://kinto.dev.mozaws.net/v1";
    sessionStorage.setItem('kinto_server',storageServer);
   function loginURI(website) {
      var currentWebsite = website.replace(/#.*/, '');
      sessionStorage.setItem('origin', currentWebsite.slice(0,32));
      var login = storageServer.replace("v1", "v1/fxa-oauth/login?redirect=");
      var redirect = encodeURIComponent(currentWebsite + '#fxa:');
      return login + redirect;
      }

   var uri = loginURI(window.location.href);
   window.location = uri;

 }

var hash = window.location.hash;
var headers = {};

if (hash.indexOf('#fxa:') == 0) {
  // We've got a token
  storageServer = sessionStorage.getItem('kinto_server');
  headers['Authorization'] = 'Bearer ' + hash.slice(5);
  var result = fetch(storageServer + '/', {headers: headers})
    .then(function (result) {
      return result.json();
    })
    .then(function (result) {
      return result.user.id;
    })
    .then(function(user_id) {
      console.log(user_id);
      $("#user_id").text(user_id);
      sessionStorage.setItem('user_id',user_id);
      var db = new Kinto({
    //--location of form, whats inside remote
        remote: sessionStorage.getItem("kinto_server"),
        bucket:"central-repository",
        headers: {Authorization: "Basic " + btoa("user:pass")}
      });
      var users = db.collection("user");

    //  if (users.forEach(users.user_id) == user_id){
    db._api.http.request(
    db._api.endpoints().record("central-repository", "user", "user_id"),
    {method: "GET"}
    ).then((resp) => {
      console.log(resp);
    });
          //list users
      //}

      users.create({
        url: sessionStorage.getItem('kinto_server'),
        user_id: sessionStorage.getItem('user_id')
       })

      .catch(function(err) {
        console.error(err);
      });
      newLocation();
    });
  }
function newLocation() {
 window.location=sessionStorage.getItem('origin')+landing_page.html;
 }

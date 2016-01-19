//retrieve location of

$(document).ready(function() {
  // Mozilla demo server (flushed every day)
  var storageServer = document.getElementById("kinto_server").value;
  if (storageServer == ''){
    storageServer = "http://central-repository.herokuapp.com/v1/"  //default
  }
  sessionStorage.setItem('kinto_server',storageServer);
  var profileServer = "https://stable.dev.lcip.org/profile/v1";
  var bucket = "central-repository";
  var collection = "users";

  // Pusher app key (as deployed on Mozila demo server)
  var pusher_key = "01a9feaaf9ebb120d1a6";

  // Local store in IndexedDB.
  var store;

  var headers;

  // Authentication from location hash
  authenticate(window.location.hash.slice(1))
    .then(function(authInfo){
      var hash = md5(user_id);
      var input = string2ascii(hash);
      var user_record_id = uuid.v4({random: input});

      var url = storageServer+'/buckets/'+ bucket +'/collections/'+ collection + '/records/'+ user_record_id;
      fetch(url,{ headers: authInfo.headers })
      .then(checkStatus)
      .then(function (response){
        authInfo.url = response.json().url;
      })

    })
    .then(function (authInfo) {
      window.location.hash = authInfo.token;
      headers = authInfo.headers;

      // Kinto client with sync options.
      var kinto = new Kinto({remote: authInfo.storageServer,
                             bucket: bucket,
                             headers: headers,
                             dbPrefix: authInfo.username});
      store = kinto.collection(collection);   //why?
    })

    function checkStatus(response) {
     if (response.status >= 200 && response.status < 300) {
              console.log(response.statusText);
              return response
     }
     else {
       if( response.status == 404){
         fetch(url,{ method:'put',
          headers: {'Authorization': authInfo.headers},
          body: JSON.stringify({
              data:{
                    url: sessionStorage.getItem('kinto_server')
            }})
            })
       }
       else{
     var error = new Error(response.statusText)
     error.response = response
     throw error
   }}
}

  // Firefox Account login
  //
  function loginURI(website) {
     var currentWebsite = website.replace(/#.*/, '');
     sessionStorage.setItem('origin', currentWebsite.slice(0,38)); //find a better way- more generalized
     var login = storageServer.replace("v1", "v1/fxa-oauth/login?redirect=");
     var redirect = encodeURIComponent(sessionStorage.getItem('origin') + '/landing_page.html' + '#fxa:');
     return login + redirect;
     }


  function authenticate(token) {
    // Take last token from store or generate BasicAuth user with uuid4.
    if (!token) {
      token = localStorage.getItem("lastToken") || "public";
    }
    localStorage.setItem("lastToken", token);

    var authInfo = {};

    if (token.indexOf('fxa:') === 0) {
      // Fxa token passed in URL from redirection.
      var bearerToken = token.replace('fxa:', '');
      authInfo.token = '';
      authInfo.headers = {Authorization: 'Bearer ' + bearerToken};

      $('#login').html('<a href="#">Log out</a>');
      $('#login').click(function() {
        window.location.hash = '#public';
        window.location.reload();
        return false;
      });

      // Fetch user info from FxA profile server
      return fetch(profileServer + '/profile', {headers: authInfo.headers})
        .then(function (response) {
          return response.json();
        })
        .then(function (profile) {
          authInfo.username = profile.uid;
          return authInfo;
        });
    }

    // Otherwise token provided via hash (no FxA).
    // Use Basic Auth as before.
    var userpass64 = btoa(token + ":notsecret");
    authInfo.token = token;
    authInfo.username = token;
    authInfo.headers = {Authorization: 'Basic ' + userpass64};

    var uri = loginURI(window.location.href);
    $('#login').html(`<a href="${uri}">Login with Firefox Account</a>`);
    return Promise.resolve(authInfo);


  }
});

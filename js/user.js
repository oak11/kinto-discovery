function authenticate(){
    var storageServer = "https://kinto.dev.mozaws.net/v1";
    sessionStorage.setItem('kinto_server',storageServer);
   function loginURI(website) {
      var currentWebsite = website.replace(/#.*/, '');
      sessionStorage.setItem('origin', currentWebsite.slice(0,38)); //find a better way- more generalized
      var login = storageServer.replace("v1", "v1/fxa-oauth/login?redirect=");
      var redirect = encodeURIComponent(sessionStorage.getItem('origin') + '/landing_page.html' + '#fxa:');
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
      var authorization =  "Basic " + btoa("user:password");
      var bucket = 'central-repository'
      var collection = 'users'
      sessionStorage.setItem('user_id','1234545678yoo ');

      function checkStatus(response) {
       if (response.status >= 200 && response.status < 300) {
        return response
       }
       else {
         if (response.status == 404){
           fetch(url,{ method:'put',
            headers: {'Authorization': authorization},
            body: JSON.stringify({
                user_id: sessionStorage.getItem('user_id'),
                url: sessionStorage.getItem('kinto_server')
                })
              })
         }
       var error = new Error(response.statusText)
       error.response = response
       throw error
         }
        }

function parseJSON(response) {
  return response.json()
}
    var url = storageServer+'/buckets/'+ bucket +'/collections/'+ collection + '/records?user_id=<'+ sessionStorage.getItem('user_id') +'>';
    fetch(url,{ headers: {'Authorization': authorization}})
    .then(checkStatus)
    .then(parseJSON)
    .then(function(data) {
      console.log('request succeeded with JSON response', data)
    }).catch(function(error) {
      console.log('request failed', error)
    });    });

  }

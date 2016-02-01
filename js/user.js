var central_repository_server = "https://kinto.dev.mozaws.net/v1";
function authenticate(){

    var storageServer = document.getElementById("kinto_server").value;
    if (storageServer == ''){
      storageServer = "https://kinto.dev.mozaws.net/v1"  //default
    }
    sessionStorage.setItem('kinto_server',storageServer);
   function loginURI(website) {
      var currentWebsite = website.replace(/#.*/, '');
      sessionStorage.setItem('origin', currentWebsite.slice(0,38)); //find a better way- more generalized
      var login = central_repository_server.replace("v1", "v1/fxa-oauth/login?redirect=");
      var redirect = encodeURIComponent(sessionStorage.getItem('origin') + '/landing_page.html' + '#fxa:');
      return login + redirect;
      }

   var uri = loginURI(window.location.href);
   window.location = uri;

 }

var hash = window.location.hash;
var headers =  {"Content-Type": "application/json"};

if (hash.indexOf('#fxa:') == 0) {
  // We've got a token
  storageServer = sessionStorage.getItem('kinto_server');
  headers['Authorization'] = 'Bearer ' + hash.slice(5);
  var result = fetch(central_repository_server + '/', {headers: headers})
    .then(function (result) {
      return result.json();
    })
    .then(function (result) {
      return result.user.id;
    })
    .then( function(user_id){
      var url = central_repository_server +'/buckets/'+ bucket +'/collections/'+ collection + '/records/'
      registerUserURL(user_id, url, headers)
    }

      /*function(user_id) {
      console.log(user_id);
      //var authorization =  "Basic " + btoa("user:password");
      var bucket = 'central-repository'
      var collection = 'users'
      var hash = md5(user_id);
      var input = parseHexString(hash);
      var user_record_id = uuid.v4({random: input});


    var url = central_repository_server +'/buckets/'+ bucket +'/collections/'+ collection + '/records/'+ user_record_id;
    //above although filter for unknown user id is used, it shows that the record exists

    fetch(url,{headers})

    .then(function(data) {
      console.log(response.statusText);
      return response
    }).catch(function(error) {
      var body = JSON.stringify({        //to pass data for new record (should run in case record does not exist)
          data:{//user_id: sessionStorage.getItem('user_id'),
                url: sessionStorage.getItem('kinto_server')
        }});
        console.log(body);

      return fetch(url,{ method:'put', headers,
       body
     });
    });

  }
*/
);
}
  function parseHexString(str) {
      var result = [];
      while (str.length >= 2) {
          result.push(parseInt(str.substring(0, 2), 16));

          str = str.substring(2, str.length);
      }

      return result;
  }

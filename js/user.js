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
      var hash = md5(user_id);
      var input = string2ascii(hash);
      var user_record_id = uuid.v4({random: input});

    //  sessionStorage.setItem('user_id','1234545678yoo ');
    var url = storageServer+'/buckets/'+ bucket +'/collections/'+ collection + '/records/'+ user_record_id;
    sessionStorage.setItem('url',url);

    fetch(url,{ headers: {'Authorization': authorization}})
    .then(checkStatus)
    .then(parseJSON)
        }).catch(function(error) {
      console.log('request failed', error)
    });


      function checkStatus(response) {
       if (response.status >= 200 && response.status < 300) { //this indicates that record is already present in central repository

          console.log(response.statusText);
          fetch(sessionStorage.getItem('url'),{method:'get',
                    headers: {'Authorization': authorization}})
          .then(function (response){
            console.log(response.json())
          })


       }
       else {
         if( response.status == 404){
           fetch(sessionStorage.getItem('url'),{ method:'put',        //here, url is not defined, hence used sessionStorage
            headers: {'Authorization': authorization},
            body: JSON.stringify({        //to pass data for new record (should run in case record does not exist)
                data:{//user_id: sessionStorage.getItem('user_id'),
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

function parseJSON(response) {
  return response.json()
}


  }
  function string2ascii(str) {
    var cc = [];
    for(var i = 0; i < str.length; ++i)
      cc.push(str.charCodeAt(i));
    return cc;
  }

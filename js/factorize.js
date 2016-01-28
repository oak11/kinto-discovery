var central_repository_server = "https://kinto.dev.mozaws.net/v1";
var bucket = 'central-repository';
var collection = 'users';

function set_url(url){
  var storageServer = document.getElementById("kinto_server").value;
  if (storageServer == ''){
    storageServer = "https://kinto.dev.mozaws.net/v1"  //default
  }
   return storageServer;
}

function add_user_url(user_storage_url)
{
  //takes the url of the storage server of the user.
  var storageServer = document.getElementById("kinto_server").value;
  // if user_storage_url has a value, it return this value
  // else it returns a default value:https://kinto.dev.mozaws.net/v1
  if (storageServer == ''){
    storageServer = "https://kinto.dev.mozaws.net/v1"  //default
  }
  //maybe we can validate the url entered here.
   return storageServer; //i.e. url
}

function store_in_central_repository(user_id){
  //gets the user_id
  //user_id is hashed to obtain a record_id
  var hash = md5(user_id);
  var input = parseHexString(hash);
  var user_record_id = uuid.v4({random: input});
  // with the above details, a url to be fetched is generated eg var url= "buckets/"+ buckets+ "/collections/"+collection...
  var url = central_repository_server +'/buckets/'+ bucket +'/collections/'+ collection + '/records/'+ user_record_id;
  //a fetch function on central repository - fetch(url,{headers}) : here, headers may create a problem.
  var status;
  fetch(url,{headers})

  .then(function(data) {

    console.log(response.statusText);
    if (statusText == 'OK'){
      status= "record already exists";
    }
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
   status = "record created"
  // if record is successfully created, set status=created
  //if record exists set status=record exists
  //else, return status= error.message()
  return status;
}

function retrieve_user_storage(bucket, collection, user_id){
  //get values of user_id
  //user_id is hashed to obtain a record_id
  var hash = md5(user_id);
  var input = parseHexString(hash);
  var user_record_id = uuid.v4({random: input});
  // with the above details, a url to be fetched is generated eg var url= "buckets/"+ buckets+ "/collections/"+collection...
  //a fetch function on central repository - fetch(url,{headers}) : here, headers may create a problem.
  // if record exists: url is returned
  // if record does not exist, default:https://kinto.dev.mozaws.net/v1 is used
     return url;
}

function authenticate(){
  //this function aims at solving the headers problem that may arise in above functions
  //this function will carry out FxA authentication.
  function loginURI(website) {
     var currentWebsite = website.replace(/#.*/, '');
     sessionStorage.setItem('origin', currentWebsite.slice(0,38)); //find a better way- more generalized
     var login = central_repository_server.replace("v1", "v1/fxa-oauth/login?redirect=");
     var redirect = encodeURIComponent(sessionStorage.getItem('origin') + '/landing_page.html' + '#fxa:');
     return login + redirect;
     }

  var uri = loginURI(window.location.href);
  window.location = uri;
  var hash = window.location.hash;
  var headers =  {"Content-Type": "application/json"};
  if (hash.indexOf('#fxa:') == 0) {
  // it will get the token and assign the proper value to the headers.
  headers['Authorization'] = 'Bearer ' + hash.slice(5);

  //return headers
  return headers;
}

function parseHexString(str) {
    var result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));

        str = str.substring(2, str.length);
    }

    return result;
}

var central_repository_server = "https://kinto.dev.mozaws.net/v1";
var bucket = 'central-repository';
var collection = 'users';
var headers = authenticate();

function getUserURL(user_storage_url)
{
  //takes the url of the storage server of the user.
   storageServer - user_storage_url;
  // if user_storage_url has a value, it return this value
  // else it returns a default value:https://kinto.dev.mozaws.net/v1
  if (storageServer == ''){
    storageServer = "https://kinto.dev.mozaws.net/v1"  //default
  }

  //maybe we can validate the url entered here.
   return storageServer; //i.e. url
}

function registerUserURL(user_id){
  //gets the user_id
  //user_id is hashed to obtain a record_id
  var hash = md5(user_id);
  var input = parseHexString(hash);
  var user_record_id = uuid.v4({random: input});
  // with the above details, a url to be fetched is generated eg var url= "buckets/"+ buckets+ "/collections/"+collection...
  var url = central_repository_server +'/buckets/'+ bucket +'/collections/'+ collection + '/records/'+ user_record_id;
  //a fetch function on central repository - fetch(url,{headers}) : here, headers may create a problem.
  var status;
  fetch(url, headers)

  .then(function(data) {

    console.log(data.statusText);
    //if (statusText == 'OK'){
      //status= "record already exists";
    }
    return response
  }).catch(function(error) {
    var body = JSON.stringify({
        data:{
              url: sessionStorage.getItem('kinto_server')
      }});
      console.log(body);
    return fetch(url,{ method:'put', headers,
     body
   });
   status = "record created"
  // if record is successfully created, set status=created
  //if record exists set status=record exists

  return status;
}

function retrieveUserStorage(user_id){
  //get values of user_id
  //user_id is hashed to obtain a record_id
  var hash = md5(user_id);
  var input = parseHexString(hash);
  var user_record_id = uuid.v4({random: input});
  // with the above details, a url to be fetched is generated eg var url= "buckets/"+ buckets+ "/collections/"+collection...
  //a fetch function on central repository - fetch(url,{headers}) : here, headers may create a problem.
  fetch(url, headers)
  .then(response => {
    if (response.status === 403) {
       return {url: "https://kinto.dev.mozaws.net/v1"};
      }
    return response.json();
    })
  // if record exists: url is returned
  // if record does not exist, default:https://kinto.dev.mozaws.net/v1 is used
     return url;
}

function authenticate(){
  //this function aims at solving the headers problem that may arise in above functions
  //this function will carry out FxA authentication.
  if (!token) {
    token = localStorage.getItem("lastToken") || "public";
  }
  localStorage.setItem("lastToken", token);

  var authInfo = {is_fxa: false};
  //if user has firefox account
  if (token.indexOf('fxa:') === 0) {
    // Fxa token passed in URL from redirection.
    var bearerToken = token.replace('fxa:', '');
    headers = {Authorization: 'Bearer ' + bearerToken};
    return headers;
  }

  //if not Firefox acount
  var userpass64 = btoa(token + ":notsecret");
  headers = {Authorization: 'Basic ' + userpass64};

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

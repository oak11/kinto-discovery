
function registerUserURL(user_id, central_repository_server, headers, user_storage_server){
  //gets the user_id
  //user_id is hashed to obtain a record_id
  var hash = md5(user_id);
  var input = parseHexString(hash);
  var user_record_id = uuid.v4({random: input});
  // with the above details, a url to be fetched is generated eg var url= "buckets/"+ buckets+ "/collections/"+collection...
  //var url = central_repository_server +'/buckets/'+ bucket +'/collections/'+ collection + '/records/'+ user_record_id;
  url = central_repository_server+ user_record_id;
  //a fetch function on central repository - fetch(url,{headers}) : here, headers may create a problem.
  var status;
  //var headers = getAuthenticationHeaders();
  return fetch(url, {headers})

  .then(function(data) {

    console.log(data.statusText);
    console.log(data);
    //if (statusText == 'OK'){
      //status= "record already exists";
    //}
    return response
  }).catch(function(error) {
    if (error.status == 404){
    var body = JSON.stringify({
        data:{
              url: user_storage_server
      }});
      console.log(body);
    return fetch(url,{ method:'put', headers,
     body
   })
 }
    else {
      console.log(error);
    }
});
}

function retrieveUserStorage(user_id, central_repository_server, default_server, headers){
  //get values of user_id
  //user_id is hashed to obtain a record_id
  var hash = md5(user_id);
  var input = parseHexString(hash);
  var user_record_id = uuid.v4({random: input});
  // with the above details, a url to be fetched is generated eg var url= "buckets/"+ buckets+ "/collections/"+collection...
  url = central_repository_server + user_record_id;
  //var headers = getAuthenticationHeaders();
  //a fetch function on central repository - fetch(url,{headers}) : here, headers may create a problem.
  return fetch(url, {headers})
  .then(response => {
    if (response.statuscode === 403) {
       return {url: default_server};
      }
    return response.json();
    })
    .then(function (response){
  // if record exists: url is returned
  // if record does not exist, default:https://kinto.dev.mozaws.net/v1 is used
  console.log(response.data.url);
     return response.data.url;           //should return url
});
}

function parseHexString(str) {
    var result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));

        str = str.substring(2, str.length);
    }

    return result;
}

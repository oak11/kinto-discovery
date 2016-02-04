function registerUserURL(user_id, central_repository_server, headers, user_storage_server){

  var user_record_id = getUserIDHash(user_id);
  // with the above details, a url to be fetched is generated eg var url= "buckets/"+ buckets+ "/collections/"+collection...
  //var url = central_repository_server +'/buckets/'+ bucket +'/collections/'+ collection + '/records/'+ user_record_id;
  var key = 'kinto:server-url:' + user_id;
  var cachedURL = localStorage.getItem('key');
  if(cachedURL == null){
  url = central_repository_server+ user_record_id;
  //a fetch function on central repository - fetch(url,{headers}) : here, headers may create a problem.
  var status;
  //var headers = getAuthenticationHeaders();
  return fetch(url, {headers})

  .then(function(data) {
    if (response.status >=200 && response.status <300){
    console.log(data.statusText);
    console.log(data);
    localStorage.setItem('key', data);
  }
    //if (statusText == 'OK'){
      //status= "record already exists";
    //}
    return data;
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

else{
  return cachedURL;
}

}

function retrieveUserStorage(user_id, central_repository_server, default_server, headers){

  var user_record_id = getUserIDHash(user_id);
  var url = central_repository_server + user_record_id;
  var key = 'kinto:server-url:' + user_id;
  var cachedURL = localStorage.getItem('key');
  if(cachedURL == null){
  return fetch(url, {headers})
  .then(function (response){
  if (response.status >=200 && response.status <300){
     console.log(response.data.url);

     return response.data.url;
   }
   if (response.status == 403) {

     console.log("returned default server: "+ default_server);
      return default_server;
     }
   return response;           //should return url
})
.catch(response => {
      console.log(response); //return?  //does not go to catch
  })
}
  else {
    return cachedURL;
  }

}

function parseHexString(str) {
    var result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));

        str = str.substring(2, str.length);
    }

    return result;
}
function getUserIDHash(user_id){
  var hash = md5(user_id);
  var input = parseHexString(hash);
  return uuid.v4({random: input});
}

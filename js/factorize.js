function registerUserURL(user_id, central_repository_server, headers, user_storage_server){

  var user_record_id = getUserIDHash(user_id);

  var key = 'kinto:server-url:' + user_id;
  var cachedURL = localStorage.getItem(key);
  if(cachedURL != null){
    return cachedURL;
  }
  url = central_repository_server+ user_record_id;

  return fetch(url, {headers})

  .then(function(data) {
    if (data.status >=200 && data.status <300){
    console.log(data.statusText);
    console.log(data);
    localStorage.setItem(key, data);
    }
    if(data.status == 404 || data.status == 403){
      var body = JSON.stringify({
          data:{
                url: user_storage_server
        }});
      return fetch(url,{ method:'put', headers,
              body})
    }
    return data;
  }).catch(function(error) {
          console.log(error);
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

function main() {
  var db = new Kinto({remote: "https://kinto.dev.mozaws.net/v1"});
  var tasks = db.collection("users");

  document.getElementById("form")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      tasks.create({
        title: event.target.title.value,
        url: event.target.url.value,
        done: false
      })
      .then(function(res) {
        event.target.title.value = "";
        event.target.url.value = "";
        event.target.title.focus();
      })
      .catch(function(err) {
        console.error(err);
      });
    });

}

window.addEventListener("DOMContentLoaded", main);

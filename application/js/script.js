

urlserver = 'http://localhost.api/index.php/';

/*
$.ajax({
    type: "GET",                // метод
    url: urlserver+'posts', // адрес
}).done(function(data) {        // в .done указывается функция, которая обрабатывает событие "done" (то есть, что запрос выполнен)
    console.log(data);
}).fail(function(data) {        // .fail — если произошла ошибка
    console.log("Oops, error: " + data);
});
*/
$( document ).ready(
    $.getJSON(urlserver+'posts', function(data){
      var items = [];

     /* $.each(data, function(key, val){
        items.push('<h2>' + title + '</h2><div class="col-lg-8">' + content + '</div>');
      });*/

     console.log(data);
     
    })
);




urlserver = '/index.php/';
files_url ='/front/files/';

userM = 'admin';
passM = '945031';


function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

function clearfields(){
	$('#title').val('');
	$('#content').val('');
	$('#files').html('');
    $('.link-item .form-control').val('');
}

function authorize(user, pass){

    var securiy_data   = {
        username: user,
        password: pass,
    };

	var token_user;

        $.ajax({
            type: 'POST',
            url: urlserver + 'auth',
            dataType: 'json',
            data: securiy_data,
            async: false,
            success: function (data) {

                token_user = data.token;

                setCookie('user_token',token_user);
            },
            error: function (xhr, str) {
                console.log('Возникла ошибка: ' + xhr.responseCode);
            }
        });

    return token_user;

};

function checkCookie(){
    //var token = $.cookie('user_token');
    token = getCookie('user_token');
    if (!token){
        token = authorize(userM,passM);
        user_name = $('#username').val();
        if (user_name) {
            $('.say-hello').html('Привет, ' + user_name);
            $('#username').val(user_name);
            $('.group-of-name').css('display', 'none');
            if (user_name) setCookie('user_name', user_name);
        };

	};
    user_name = getCookie('user_name');

    if(user_name){
        $('.say-hello').html('Привет, ' + user_name);
        $('#username').val(user_name);
        $('.group-of-name').css('display','none');
    } else {
        user_name = $('#username').val();
        if (user_name) setCookie('user_name',user_name);
    };

    return token;
}

function createPost(){



      var token = checkCookie();
	  var post   = {
		 title: $('#title').val(),
		 content: $('#content').val(),
		 user_name: $('#username').val(),
         user_token: token,
	  };

   // console.log(post);

    	//console.log(token);

	  if (post.title){

          var files_array = [];
          $('#files p').each(function() {
              var itemurl =[];
              itemurl['text'] = $(this).html();
              itemurl['type'] = 1;
              files_array.push(itemurl);
          });
			$('.link-item .form-control').each(function () {
                var itemurl =[];
                itemurl['text'] = $(this).val();
                itemurl['type'] = 2;
                if(itemurl['text']) files_array.push(itemurl);
            });

          //console.log(files_array);
		
		//post create
		   $.ajax({
          type: 'POST',
          url: urlserver+'posts',
          data: post,
		  headers: {
			'Authorization': 'Bearer ' + token
		  },
          success: function(data) {
            //console.log(data);
			var blog_id = data.id;
              //console.log(blog_id);
             // socket.send('addElement');
              socket.send('{"command":"addElement","id":"'+ blog_id +'"}');

			//files create


              for (var i=0; i < files_array.length; i++) {
					var itemurl = files_array[i];
					if (itemurl){
						var file ={
							url: itemurl['text'],
							type: itemurl['type'],
							blog_id:  blog_id,
							name: itemurl['text'],
							user_name: post.user_name,
						};
                       // console.log(file);
						
						$.ajax({
						  type: 'POST',
						  url: urlserver+'upfiles',
						  data: file,
						  headers: {
							'Authorization': 'Bearer ' + token
						  },
						  success: function(data) {
							//console.log(data);
							//update_post_list();

						  },
						  error:  function(xhr, str){
							console.log('Возникла ошибка: ' + xhr.responseCode);
						  }
						});
					};
				};


			clearfields();
			
          },
          error:  function(xhr, str){
			console.log('Возникла ошибка: ' + xhr.responseCode);
          }
        });
		
		

		  

	  };

};







function post_echo(item){

    date = getDateInFormat(item.created_at);
    var token = checkCookie();
    if (item.user_token == token) {
        var print_button = '<button class="btn btn-default" type="button" onclick="deletePost(' + item.id + ');">Удалить пост</button>';
    } else {
        var print_button = '';
    }

    $('#post-list').prepend('<div class="col-lg-12 sb-card" id="postitem-' + item.id + '"><span>' + date + '</span><br /><h3 id="' + item.id + '">' + item.title + '</h3><p>' + item.content + '</p>' + print_button +
        '<div class="likeblok"><div class="like-buttom" onclick="sendLike(' + item.id + ')"></div><span class="likes" id="likes-' + item.id + '"></span></div></div>');
    getLike(item.id);

    $.ajax({
            type: 'GET',
            url: urlserver + 'upfiles?s[blog_id]='+ item.id,
            success: function(data_files) {

                var html_files = '';

                for (var j = 0; j < data_files.length; j++) {
                    item_files = data_files[j];

                    html_files = printFiles(item_files, html_files);
                };

                $('#post-list #postitem-' + item.id).append(html_files);
                $("a[rel^='prettyPhoto']").prettyPhoto();

            }
    });
}

function print_post(post_id){
  //  console.log(post_id);
    $.ajax({
        type: 'GET',
        url: urlserver+'posts?s[id]='+post_id,
        async: false,
        success: function (data) {

            item = data[0];
           // console.log(item);
              post_echo(item);
           // console.log(item);*/
        }
    });

}

function update_post_list(){


    $.ajax({
        type: 'GET',
        url: urlserver+'posts',
        async: false,
        success: function(data) {
            for (var i=0; i < data.length; i++) {
                item=data[i];
                post_echo(item);
                $('.preloader').fadeOut();
            }
        }
    });



};

function deletePost(id){

    $.ajax({
        type: 'DELETE',
        url: urlserver+'posts/'+id,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(data) {

           // update_post_list();
            $('#postitem-'+id).remove();
            socket.send('{"command":"deleteElement","id":"'+ id +'"}');
        },
        error:  function(xhr, str){
            console.log('Возникла ошибка: ' + xhr.responseCode);
        }
    });

};

function getLike(post_id){

    var token = checkCookie();
    $.ajax({
        type: 'GET',
        url: urlserver+'likes?s[post_id]='+post_id,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(data) {
            $('#likes-'+ post_id).html(data.length);
        },
        error:  function(xhr, str){
            console.log('Возникла ошибка: ' + xhr.responseCode);
        }
    });

};

function checkLike(post_id) {
    var token = checkCookie();
    var is_like;
    $.ajax({
        type: 'GET',
        url: urlserver+'likes?s[post_id]='+post_id+'&s[token]='+token,
        async: false,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(data) {
           is_like = data.length;

            //console.log(data.length);
        },
        error:  function(xhr, str){
            console.log('Возникла ошибка: ' + xhr.responseCode);
        }
    });
    return is_like;
}

function sendLike(post_id){

    var token = checkCookie();
    var is_like = checkLike(post_id);
    var like_data ={
        post_id: post_id,
        token: token,
    };
   // console.log(is_like);
    if (is_like == 0) {
        $.ajax({
            type: 'POST',
            url: urlserver + 'likes',
            data: like_data,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (data) {
                getLike(post_id);
                socket.send('{"command":"updateLike","id":"'+ post_id +'"}');
            },
            error: function (xhr, str) {
                console.log('Возникла ошибка: ' + xhr.responseCode);
            }
        });
    } else{
        alert('Вы уже голосовали');
    };

};

function getDateInFormat(date_value){
    date = new Date(parseInt(date_value) * 1000);
    var d = date.getDate();
    var m =  date.getMonth();
    m += 1;  // JavaScript months are 0-11
    var y = date.getFullYear();
    var hh = date.getHours();
    var mm = date.getMinutes();

    var date_string = d + "." + m + "." + y + ' ' + hh + ':' + mm;

    return date_string;
};

function printFiles(item_files, html_files){

    var current_url = item_files.url;

    index_search = current_url.indexOf("yout");


	if (item_files.type == 1){
        html_files = html_files + '<a rel="prettyPhoto" href ="' + files_url + item_files.url + '"><img width="50px" src="' + files_url + item_files.url + '" /></a>';
	} else {
        if(index_search == -1) {
            html_files = html_files + '<a target="_blank" href ="' + item_files.url + '">Ссылка на страницу</a>';
        } else {
            html_files = html_files + '<a rel="prettyPhoto"  href ="' + item_files.url + '"><img width="50px" src="img/youtube.png"/></a>';
        }
	}
    return html_files;
}

function addLinkField(){
	$('.link-list').append('<div class="link-item"><input class="form-control" id="input-link" type="text" value="" /></div>');
};

function checkChange(){
	var current_count = parseInt($('.postcount').html());
    ajax_get(urlserver+'posts', function(data) {
    	if (data.length != current_count){

		}
    });

};




$( document ).ready(function() {

    update_post_list();
    socket = new WebSocket('ws://localhost.api:8080');
    socket.onopen = function(e) {
    };
    socket.onmessage = function(event) {
        var messages = JSON.parse(event.data);
        console.log(messages[0]);

        switch (messages[0].command) {
            case 'updateLike': getLike(messages[0].id); break;
            case 'deleteElement': $('#postitem-'+messages[0].id).remove(); break;
            case 'addElement': print_post(messages[0].id); break;
        };
    };


    $("a[rel^='prettyPhoto']").prettyPhoto();

});


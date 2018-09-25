/*!
Script Name: SocialLock
Script URI: http://4coders.ru/sociallock
Author: Nikolay Ageev
Author URI: http://4coders.ru/
Author MAIL: tranebest@mail.ru
Description: Open full content after sharing in social networks.
Version: 1.0.0
License: GNU General Public License v3.0
License URI: http://www.gnu.org/licenses/gpl-3.0.html

4Coders SocialLock script, Copyright 2016
4Coders is distributed under the terms of the GNU GPL
*/
var content_class = '.content'; //Блок, в котором будет социальный замок
var domain = '.ru'; //Домен первого уровня вашего сайта .ru .com .org .net...
var content_file = (location.href).match(/([\w,\s-]+)\.[A-Za-z]{3}/)[1]+'.txt';
var loc = location.href;
var window = top.location;
var tw_watched=0,fb_watched=0,vk_watched=0,odkl_watched=0,gg_watched=0,mru_watched=0,bl_watched = 0;

if(!Cookies.get('location'))setcookies();
else if(!(loc.indexOf(Cookies.get('location')) >= 0) && (loc.split(domain)[0] == Cookies.get('location').split('.ru')[0]))setcookies();
var my_redirect_uri = Cookies.get('location');

function setcookies(){
	console.log('set_cookies!');
	Cookies.set('location', location.href);
	Cookies.set('count', '2');
	Cookies.set('twit', 'false');
	Cookies.set('vk', 'false');
	Cookies.set('fb', 'false');
	Cookies.set('gg', 'false');
	Cookies.set('mru', 'false');
	Cookies.set('odkl', 'false');
	Cookies.set('blog', 'false');
}

function gotoloc(){
	location.href = Cookies.get('location');
}
//OPEN_CONTENT
$(function(){
	$(".repost").append("Чтобы дочитать статью, просим вас поддержать наш проект и рассказать двумя способами о нас!<br>Осталось репостов: <b class='numb'></b>");
	$(".repost").css({"background":"rgba(0,0,0,.1)","font-size":"1.3em","color":"#91a9d8","padding-left":"20px","border-radius":"20px","margin":"2%"});
	$(".numb").css("color","red");
	$(".share_but").css({"width":"40px","height":"40px","border-radius":"3px","margin":"0","padding":"0","margin-left":"5px"});

	$('.numb').text(Cookies.get('count'));
	if(Cookies.get('count')=='0'){
	$(content_class).append($('<span></span>').load(content_file));
	$(".open,.repost,.share_but,.vk").css("display","none");
}
});
//--------------------------------------------------------

$(window).focus(function() {
	$('.numb').text(Cookies.get('count'));
	if(vk_clicked && vk_watched == 0){
		vk_watched = 0;
		location.href ="https://oauth.vk.com/authorize?client_id=CLIENT_ID&display=page&scope=wall&response_type=token&v=5.45&redirect_uri="+my_redirect_uri;
	}
	if(tw_clicked && Cookies.get('twit')=='false'){
		check_tw();	
	}
	if(fb_clicked && Cookies.get('fb') == 'false'){
		check_fb();		
	}
	if(odkl_clicked && Cookies.get('odkl') == 'false'){
		odkl_watched = 1;	
		check_odkl();		
	}
	if(gg_clicked && Cookies.get('gg') == 'false'){
		gg_watched = 1;	
		check_gg();		
	}
	if(mru_clicked && Cookies.get('mru') == 'false'){
		mru_watched = 1;	
		check_mru();		
	}
	if(bl_clicked && Cookies.get('blog') == 'false'){
		bl_watched = 1;	
		check_bl();		
	}
});
//--------------------------------------------------------

//GOOGLE_CHECK
var bl_clicked = false;
function check_bl(){
	location.href = "https://accounts.google.com/o/oauth2/auth?&response_type=token&client_id=CLIENT_ID&scope=https://www.googleapis.com/auth/blogger&redirect_uri="+my_redirect_uri+"?bl=1";
}
if(loc.indexOf("bl=1") >= 0){
	var gg_token = loc.split("access_token=")[1].split("&")[0];
	
	$.ajax({    
      url: "https://www.googleapis.com/blogger/v2/users/self/blogs?access_token="+gg_token,
	  dataType: "jsonp",  
     success: function(data){
		 var gg_id = data.items[0].id;
	$.ajax({    
      url: "https://www.googleapis.com/blogger/v2/blogs/"+gg_id+"/posts?access_token="+gg_token,
	  dataType: "jsonp",  
     success: function(data){
		var same = (document.title == data.items[0].title);
				 if(same){
			 var left = Cookies.get('count');
			 if(Cookies.get('count')=='1'){
				if(Cookies.get('blog')=='false')Cookies.set('count', '0');
	}
			if(Cookies.get('count')=='2'){
				Cookies.set('blog', 'true');
				Cookies.set('count', '1');
			}
		 }
		 gotoloc();
    }
});
	 }
  });
}
//--------------------------------------------------------

//ODKL_CHECK
var odkl_clicked = false;
function check_odkl(){
  location.href = "https://connect.ok.ru/oauth/authorize?client_id=CLIENT_ID&scope=VALUABLE_ACCESS&response_type=token&redirect_uri="+my_redirect_uri;
}
	if(loc.indexOf("session_secret_key") >= 0){
	var odkl_token = loc.split("access_token=")[1].split("&")[0];
$.ajax({    
	  type:'post',
      url: "odkl.php",
	  data:{'token':odkl_token,'url':document.title},
	  dataType: "text",  
     success: function(data){
		  if(data=='yes'){
			var left = Cookies.get('count');
			 if(Cookies.get('count')=='1'){
				if (Cookies.get('odkl')=='false'){
					Cookies.set('count', '0');	
				}
	}
			if(Cookies.get('count')=='2'){
				Cookies.set('odkl', 'true');
				Cookies.set('count', '1');
			}
		}
		gotoloc();
     }
});
}
//--------------------------------------------------------
//MAILRU_CHECK
var mru_clicked = false;
function check_mru(){
var m_url_auth = "https://connect.mail.ru/oauth/authorize?client_id=CLIENT_ID&response_type=token&redirect_uri="+my_redirect_uri;
location.href = m_url_auth;
}
if(loc.indexOf("refresh_token") >= 0){
	var m_token = loc.split("access_token=")[1].split("&")[0];
	var sig = $.md5("app_id=741983limit=1method=stream.getByAuthorsecure=1session_key="+m_token+"5c997c12t6g240545e3bf6h8d2e8b14");
	var m_url_posts = "http://www.appsmail.ru/platform/api?method=stream.getByAuthor&secure=1&app_id=741983&limit=1&session_key="+m_token+"&sig="+sig;
	if(m_url_posts){
$.ajax({    
	  type:'post',
      url: "mru.php",
	  data:{'token':m_token},
	  dataType: "json",  
     success: function(data){
		  if(data[0].title==document.title){	  
			var left = Cookies.get('count');
			 if(Cookies.get('count')=='1'){
				if (Cookies.get('mru')=='false'){
					Cookies.set('count', '0');	
					location.reload();
				}
	}
			if(Cookies.get('count')=='2'){
				Cookies.set('mru', 'true');
				Cookies.set('count', '1');
			}
		}
		gotoloc();
     }
});
}
}
//--------------------------------------------------------

//GOOGLE_CHECK
var gg_clicked = false;
function check_gg(){
	location.href = 'https://accounts.google.com/o/oauth2/auth?response_type=token&client_id=CLIENT_ID&scope=https://www.googleapis.com/auth/plus.me%20https://www.googleapis.com/auth/userinfo.profile&redirect_uri='+my_redirect_uri+'?gg=1';
}
if(loc.indexOf("gg=1") >= 0){
	var gg_token = loc.split("access_token=")[1].split("&")[0];
	
	$.ajax({    
      url: "https://www.googleapis.com/oauth2/v1/userinfo?access_token="+gg_token,
	  dataType: "jsonp",  
     success: function(data){
		var gg_id = data.id;
	$.ajax({    
      url: "https://www.googleapis.com/plus/v1/people/"+gg_id+"/activities/public?&maxResults=1&access_token="+gg_token,
	  dataType: "jsonp",  
     success: function(data){
		var same = (Cookies.get('location') == data.items[0].object.attachments[0].url);
				 if(same){
			 var left = Cookies.get('count');
			 if(Cookies.get('count')=='1'){
				if(Cookies.get('gg')=='false')Cookies.set('count', '0');
	}
			if(Cookies.get('count')=='2'){
				Cookies.set('gg', 'true');
				Cookies.set('count', '1');
			}
		 }
		 gotoloc();
    }
});
	 }
  });
}
//--------------------------------------------------------
//FACEBOOK_CHECK
var fb_clicked = false;
var fb_id;
var fb_token;


function check_fb(){
	location.href = "https://www.facebook.com/dialog/oauth?client_id=CLIENT_ID&redirect_uri="+my_redirect_uri+"?f=1&response_type=token&scope=email,user_birthday";
}

if(loc.indexOf("f=1") >= 0){
		fb_token = loc.split("access_token=")[1].split("&")[0];
		 $.ajax({    
      url: "https://graph.facebook.com/me?access_token="+fb_token,
	  dataType: "jsonp",  
     success: function(data){
		 fb_id = data.id;
		     $.ajax({    
      url: "https://graph.facebook.com/"+fb_id+"/feed?access_token="+fb_token+"&fields=link,description&limit=1",
	  dataType: "jsonp",  
     success: function(data){
		 	var left = Cookies.get('count');
			 if(Cookies.get('count')=='1'){
				if(Cookies.get('fb')=='false')Cookies.set('count', '0');
	}
			if(Cookies.get('count')=='2'){
				Cookies.set('fb', 'true');
				Cookies.set('count', '1');
			}
		 gotoloc();
/*
		 var same = (Cookies.get('location') == data.data[0].link);
		 if(same){
			 var left = Cookies.get('count');
			 if(Cookies.get('count')=='1'){
				if(Cookies.get('fb')=='false')Cookies.set('count', '0');
	}
			if(Cookies.get('count')=='2'){
				Cookies.set('fb', 'true');
				Cookies.set('count', '1');
			}
		 }
		 gotoloc();*/
    }
});
		 
	}
		 });
}
//--------------------------------------------------------
//TWITER_CHECK
function check_tw(){
	location.href = 'twitter_check.php?redir='+my_redirect_uri;
  }
var tw_clicked = false;
var tw_name;
if(loc.indexOf("twit_text") >= 0){
	var twit_text = decodeURIComponent(location.href).split('twit_text=')[1].split('+')[0];
	var same = document.title.indexOf(twit_text);
		 if(same>=0){
			 var left = Cookies.get('count');
			 if(Cookies.get('count')=='1'){
				if(Cookies.get('twit')=='false')Cookies.set('count', '0');
	}
			if(Cookies.get('count')=='2'){
				Cookies.set('twit', 'true');
				Cookies.set('count', '1');
			}
		 }
		 gotoloc();
}
//--------------------------------------------------------

//VK_CHECK
	var vk_clicked = false;
	var redir = loc;
	if (loc.indexOf("user_id") >= 0){
	var token = loc.split("access_token=")[1].split("&")[0];
	var userid = loc.split("user_id=")[1];
	$.ajax({     
      url: "https://api.vk.com/method/wall.get?v=5.3&domain="+userid+"&count=1&access_token="+token,
     dataType: "jsonp",    
     success: function(data){ 
		 if(data.response.items[0].text==document.title){
			var left = Cookies.get('count');
			 if(Cookies.get('count')=='1'){
				if (Cookies.get('vk')=='false'){
					Cookies.set('count', '0');	
					location.reload();
				}
	}
			if(Cookies.get('count')=='2'){
				Cookies.set('vk', 'true');
				Cookies.set('count', '1');
			}
		}
		gotoloc();
     }
});
}
//--------------------------------------------------------

//PANEL
$(".open").after(function(){
document.write(VK.Share.button({
	url: my_redirect_uri,
	title: document.title
	}, {
	type: 'custom', 
	text: "<img class='share_but vk' src='socimg/v.png'/>"
	})); 
});
$("a[href^='http://vk.com']").after("<img class='share_but tweeter' src='socimg/t.png'><img class='share_but facebook' src='socimg/f.png'><a class='odkl-klass-stat' href="+loc+" onclick='ODKL.Share(this);return false;' ><img class='share_but odkl' src='socimg/o.png'></a><img class='share_but google' src='socimg/g.png'><img class='share_but mail' src='socimg/m.png'><img class='share_but blog' src='socimg/b.png'>");
//--------------------------------------------------------


//FACEBOOK
$( ".facebook" ).click(function() {
  fb_clicked = true;
  var facetab = window.open("https://www.facebook.com/sharer/sharer.php?u="+loc, '', 'width=500');
});
//--------------------------------------------------------

//VK
$( ".vk" ).click(function() {
  vk_clicked = true;
});
//--------------------------------------------------------

//TWEETER
$( ".tweeter" ).click(function() {
  tw_clicked = true;
  var tweettab = window.open("https://twitter.com/intent/tweet?text="+document.title+": "+loc, '', 'width=500');
});
//--------------------------------------------------------

//ODNOKLASSNIKI
$( ".odkl-klass-stat" ).click(function() {
  odkl_clicked = true;
});
//--------------------------------------------------------

//GOOGLE
$( ".google" ).click(function() {
  gg_clicked = true;
  var googletab = window.open("https://plus.google.com/share?url="+loc, '', 'width=500');
});
//--------------------------------------------------------

//BLOGGER
$( ".blog" ).click(function() {
  bl_clicked = true;
  var blogtab = window.open("https://www.blogger.com/blog-this.g?u="+loc+"&n="+document.title+"&t="+$(content_class).text(), '', 'width=500');
});
//--------------------------------------------------------

//MAIL
$( ".mail" ).click(function() {
  mru_clicked = true;
  var mailtab = window.open("http://connect.mail.ru/share?url="+loc+"&amp;", '', 'width=500');
});
//--------------------------------------------------------
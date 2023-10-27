$(document).ready(function () {
var holder = null;
var frame_holder =[];
var cur_position=0;
var frame_length=0;
var s_frame_length=0;
var a_frame_length=0;
var p_frame_length=0;
var ham_open=false;
var show_story=true;
var show_notional=false;
var isFull=false;
var isDigitalExperience=false;

/*Get the page parameters  index.html?jsonId=123456798&pin=datascience */
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

//json id reads a parameter to get the json control file
//var jsonId = 'https://isdportal.oracle.com/pls/portal/tsr_admin.isd_portlets4.download_repo?p_id='+getUrlParameter('jsonId');
//the pin serves as a redirect in case the generic launchpad does not have an authenticated user.
//var pin = getUrlParameter('pin');
var pin = 'schoolastic'
//console.log("Parameter check json repo id is: "+jsonId+"    PIN is:  " + pin);

/*Gathers information for storyboard from json control file*/
$.getJSON('js/'+pin+'.json', function (data) {
/*$.getJSON(jsonId, function (data) { */
        try{
        holder = data;
        buildStoryboard();
        }
        catch(err){
            log('Error building core HTML from JSON.',err.message);
        }
}).fail(function() {
//Error function is in place if the user has not authenticated.
console.log("Can not retrieve json control file redirecting for authenitcation to https://launch.oracle.com/?"+ pin);
 $("#title_name").text("Please navigate to https://launch.oracle.com/?"+ pin+" to properly authenticate and view the website.");
// window.location="https://launch.oracle.com/?"+pin;
});


/*Build Core Asset List*/
function buildStoryboard() {
console.log("Attempting to build Storyboad Navigation Menu.");

v_hidden_preload="<div id=\"hidden_preload\">";
v_nav="<ul id=\"nav_menu\"><li><a class=\"home\" href=\"#\">Home</a></li>";

try{
$.each(holder.storyboard, function(index, content) {
      //set the title
      $("#title_name").html(content.title);
      $("#title_frame").html(content.title);


      //set the title text color
      if (!content.titletextcolor || !content.titletextcolor.length){}
      else {
       $("#title_name").css('color',content.titletextcolor);
      }

     //set bg storyoverlay if present
      if (!content.storyoverlay || !content.storyoverlay.length){}
      else {
        $("#container").css('background','url('+content.storyoverlay+') no-repeat fixed center center / cover');
      }

      //set background image if present
      if (!content.background || !content.background.length){    }
      else {
        setTimeout(function(){
        $("html").css('background','url('+content.background+') no-repeat fixed center center / cover');
        },900);
      }

      //set background color if present
      if (!content.bgcolor || !content.bgcolor.length){    }
      else{
        $("html").css('background-color',''+content.bgcolor+'');
      }

      //set body text color
      if (!content.textcolor || !content.textcolor.length){}
      else { $("html").css('color',content.textcolor); }

      //set body text color
      if (!content.navmenucolor || !content.navmenucolor.length){}
      else { $("#left_menu").css('background-color',content.navmenucolor); }

      //if video is empty or null value then do not display the watch button.
      if (!content.video || !content.video.length){ $("#s_video").hide(); }
      else{$("#s_video").attr("video-link", content.video);
      v_nav=v_nav+"<li><a class=\"showvideo\" href=\"#\" video-link=\""+content.video+"\">Watch Story</a></li>";
      }

      //if there are no storyframes then we are in the DIGITAL ACCELERATE
      if (!content.storyframes || !content.storyframes.length){
        $("#s_launch").hide();
        isDigitalExperience =true;
        console.log("Landing Pad mode set to : Digital Experience");
      }

      //Add Innovation Board
      if (!content.innovationboard || !content.innovationboard.length){ }
      else{
        v_nav=v_nav+"<li><a  href=\""+content.innovationboard+"\" class=\"d_inno\" target=\"_IVM\">Innovation Board</a></li>";
      }


      //Add Value map
      if (!content.ivm || !content.ivm.length){ }
      else{
        v_nav=v_nav+"<li><a  href=\""+content.ivm+"\" class=\"d_ivm\" target=\"_IVM\">Value Map</a></li>";
      }


      //Add Value map
      if (!content.opptsketch || !content.opptsketch.length){ }
      else{
        v_nav=v_nav+"<li><a  href=\""+content.opptsketch+"\" class=\"d_oppt\" target=\"_oppt\">Opportunity Sketch</a></li>";
        /*if (isDigitalExperience) {
          $("#s_opptsketch").attr("href", content.opptsketch);
          $("#s_opptsketch").show();
        }*/
      }

      //if is Digital experience do not show the story in the hamburger menu.
      if (!isDigitalExperience) {
      v_nav=v_nav+"<li><a class=\"s_launch\" href=\"#\">Storyboard</a></li>";
      }

      //if simulated prototype present
      if (!content.prototype || !content.prototype.length){ }
      else {
          p_frame_length=content.prototype.length;
          console.log("Prototype frame length is: "+p_frame_length);
          if (p_frame_length>0){
              v_nav=v_nav+"<li><a  href=\"#\" class=\"l_proto\" >Navigate Prototype</a></li>";
              //build hidden preload for prototype
                    $.each(content.prototype, function(index, p_content) {
                      v_hidden_preload=v_hidden_preload+"<img src=\""+p_content.image+"\">";
                    });
          }
      }

      //checking for prototype video
      if (!content.prototypevideo || !content.prototypevideo.length){ }
      else {
       v_nav=v_nav+"<li><a  href=\"#\" class=\"showvideo\" video-link=\""+content.prototypevideo+"\">Watch Prototype</a></li>";
      }


      //if notional architecture present
      if (!content.architecture || !content.architecture.length){ }
      else {
          a_frame_length=content.architecture.length;

          console.log("Notional Architecture frame length is: "+a_frame_length);

          if (a_frame_length>0){
              v_nav=v_nav+"<li><a  href=\"#\" class=\"l_arch\" >Notional Architecture</a></li>";

              //build hidden preload for architecture
              $.each(content.architecture, function(index, a_content) {
                      v_hidden_preload=v_hidden_preload+"<img src=\""+a_content.image+"\">";
              });

          }
      }

      // Business Value
      if (!content.businessvalue || !content.businessvalue.length){ }
      else {
        v_nav=v_nav+"<li><a  href=\""+content.businessvalue+"\" class=\"d_busval\" target=\"_ppt\">Business Value</a></li>";
      }

      // Launch Checklist
      if (!content.impactchecklist || !content.impactchecklist.length){ }
      else {
        v_nav=v_nav+"<li><a  href=\""+content.impactchecklist+"\" class=\"d_impact\" target=\"_ppt\">Launch Checklist</a></li>";
      }

      // LaunchPlan
      if (!content.launchplan || !content.launchplan.length){ }
      else {
        v_nav=v_nav+"<li><a  href=\""+content.launchplan+"\" class=\"d_launch\" target=\"_ppt\">Launch Plan</a></li>";
         if (isDigitalExperience) {
              $("#s_launchplan").attr("href", content.launchplan);
              $("#s_launchplan").show();
            }
      }


         //checking for ppt link
          if (!content.pptlink || !content.pptlink.length){ }
          else {
           v_nav=v_nav+"<li id=\"dl_ppt\"><a  href=\""+content.pptlink+"\" class=\"d_ppt\" target=\"_ppt\">Download PPT</a></li>";
          }

          if (!content.pdflink || !content.pdflink.length){ }
          else {
           v_nav=v_nav+"<li id=\"dl_pdf\"><a  href=\""+content.pdflink+"\" class=\"d_pdf\" target=\"_pdf\">Download</a></li>";
          }


      //See if click through demo ppt exists
      if (!content.clickthroughdemo || !content.clickthroughdemo.length){ }
      else {
        v_nav=v_nav+"<li><a  href=\""+content.clickthroughdemo+"\" class=\"d_click\" target=\"_ppt\">Click Through Demo</a></li>";
      }

      //See if setup checklist exists
      if (!content.userguide || !content.userguide.length){ }
      else {
        v_nav=v_nav+"<li><a  href=\""+content.userguide+"\" class=\"d_user\" target=\"_ppt\">User Guide</a></li>";
      }


      if (!isDigitalExperience) {
          s_frame_length=content.storyframes.length;

          //build hidden preload storyboard images.
          $.each(content.storyframes, function(index, s_content) {
          v_hidden_preload=v_hidden_preload+"<img src=\""+s_content.image+"\">";
          });
       }
          //delay the loading of the images inside the story for 3 seconds so the
          //bandwidth for the background images can occur
         setTimeout(function(){ $("#hidden_preload").replaceWith("</div>"+v_hidden_preload) },3200);


     //set the navigation menu
     v_nav=v_nav+"</ul>"
     $("#nav_menu").replaceWith(v_nav);
});

}
catch(err){
  log('Error in buildstoryboard() function.',err.message);
}

if (!isDigitalExperience) {
setFrame(0);
}

}


function setFrame(frame_number){
$.each(holder.storyboard, function(index, content) {
      //if you are showing the story find frame
      if (show_story) {
          console.log("Looking for story frame."+frame_number);
          $.each(content.storyframes, function(index, s_content) {
            if (index === frame_number){
             $("#f_text").html(s_content.text);
             $("#f_image").attr("src", s_content.image);
             log('Story frame set to: ',s_content.image);

            }
      });
      }
      else if(show_notional){
          console.log("Looking for notional architecture frame."+frame_number);
          $.each(content.architecture, function(index, a_content) {
                if (index === frame_number){
                 $("#f_text").html(a_content.text);
                 $("#f_image").attr("src", a_content.image);
                 log('Notional Architecture frame set to: ',a_content.image);
                }
           });
      }
      //else showing architecture
      else {
           console.log("Looking for prototype frame."+frame_number);
           $.each(content.prototype, function(index, p_content) {
                if (index === frame_number){
                 $("#f_text").html(p_content.text);
                 $("#f_image").attr("src", p_content.image);
                 log('Prototype frame set to: ',p_content.image);
                }
           });
      }
});
//set the current position to the newly navigated frame position
cur_position=frame_number;
console.log("current frame set to."+cur_position);

}


//code to launch the storyframe
$(document.body).on('click', '.s_launch' , function(e) {
show_story=true;
show_notional=false;
cur_position=0;
frame_length=s_frame_length;
setFrame(0);
$("#container").hide();
$("#storyframe").show();
log('Launch Storyboard Button Pressed',' ');
});


$(document.body).on('click', '.l_proto' , function(e) {
show_story=false;
show_notional=false;
cur_position=0;
frame_length=p_frame_length;
setFrame(0);
$("#container").hide();
$("#storyframe").show();
log('Launching Navigate Prototype Button Pressed',' ');
});

$(document.body).on('click', '.l_arch' , function(e) {
show_story=false;
show_notional=true;
cur_position=0;
frame_length=a_frame_length;
setFrame(0);
$("#container").hide();
$("#storyframe").show();
log('Launching Notional Architecture Button Pressed',' ');
});


//log a download click
$(document.body).on('click', '.d_ppt' , function(e) {
log('PPT Downloaded',' ');
});

//log a innovation board click
$(document.body).on('click', '.d_inno' , function(e) {
log('Innovation Board Downloaded',' ');
});

//log ivm click
$(document.body).on('click', '.d_ivm' , function(e) {
log('IVM Downloaded',' ');
});

//log oppt sketch click
$(document.body).on('click', '.d_impact' , function(e) {
log('Impact Checklist Downloaded',' ');
});

//log oppt sketch click
$(document.body).on('click', '.d_busval' , function(e) {
log('Business Value Downloaded',' ');
});

//log oppt sketch click
$(document.body).on('click', '.d_launch' , function(e) {
log('Launchplan Infographic Downloaded',' ');
});

$(document.body).on('click', '.d_pdf' , function(e) {
log('PDF Presentation Downloaded',' ');
});

$(document.body).on('click', '.d_oppt' , function(e) {
log('Opportunity Sketch Downloaded',' ');
});

$(document.body).on('click', '.d_click' , function(e) {
log('Click Through Downloaded',' ');
});

$(document.body).on('click', '.d_user' , function(e) {
log('User Guide Downloaded',' ');
});

/*Hamburger Click*/
$(document.body).on('click', '.hamburger' , function(e) { hamlogic();});

/*Function manages the dynamic display of the hamburger menu through on and off states*/
function hamlogic(){
if (ham_open){
ham_open=false;
$("#left_menu").hide();
$("#container").removeClass("container_80").addClass("container_100");
$("#storyframe").removeClass("container_80").addClass("container_100");
$("#l_nav").removeClass("l_nav_left20").addClass("l_nav_left0");
log('Hamburger Hidden',' ');
}
else{
ham_open=true;
$("#left_menu").show();
$("#container").removeClass("container_100").addClass("container_80");
$("#storyframe").removeClass("container_100").addClass("container_80");
$("#l_nav").removeClass("l_nav_left0").addClass("l_nav_left20");
log('Hamburger Shown',' ');
}
}

/*Nav Menu home click*/
$(document.body).on('click', '.home' , function(e) {
$("#storyframe").hide();
$("#container").show();

});

/*Code to close the matrix navigation*/
$(document.body).on('click', '#c_matrix' , function() {
     $("#matrixframe").hide();
} );

/*Opens the matrix navigation menu*/
$(document.body).on('click', '.matrix' , function(e) {

var mframe="<div id=\"matrixframe\" class=\"container_100 mcenter\"><span id=\"c_matrix\" class=\"close-btn\"><a href=\"#\">X</a></span><div class=\"matrixCenter\"><h3>Select a image below to view in more detail:</h3><br>";
var i = 0;
$.each(holder.storyboard, function(index, content) {
      if (show_story) {
           log('Showing Matrix navigation for Story',' ');
          $.each(content.storyframes, function(index, s_content) {
            mframe=mframe+"<img src=\""+s_content.image+"\" class=\"matrixThumb\" frameNumber=\""+i+"\" title=\"Click to go to frame.\">";
            i++;
        });
      }
      else if(show_notional){
           log('Showing Matrix navigation for Notional Architecture',' ');
           $.each(content.architecture, function(index, s_content) {
               mframe=mframe+"<img src=\""+s_content.image+"\" class=\"matrixThumb\" frameNumber=\""+i+"\" title=\"Click to go to frame.\">";
              i++;
           });
      }
      //else showing simulated prototype
      else {
           log('Showing Matrix navigation for Prototype',' ');
           $.each(content.prototype, function(index, s_content) {
              mframe=mframe+"<img src=\""+s_content.image+"\" class=\"matrixThumb\" frameNumber=\""+i+"\" title=\"Click to go to frame.\">";
              i++;
           });
      }

});
   mframe=mframe+"</div></div>";
   $("#matrixframe").replaceWith(mframe);
   $("#matrixframe").show();
});

$(document.body).on('click', '.matrixThumb' , function(e) {

console.log("Frame Number "+$(this).attr('frameNumber')+"  clicked");

var matrixFrameNumber=parseInt($(this).attr('frameNumber'));
$("#matrixframe").hide();
setFrame(matrixFrameNumber);
});

/*Go to the next slide.*/
$(document.body).on('click', '.n_forward' , function(e) {
moveForward();
});

/*function to move forward*/
function moveForward(){

        if (cur_position<frame_length){
        cur_position++;
        log('Moving to next frame: ',' ');
        setFrame(cur_position);
        }
}

/*function to moveBack*/
function moveBack(){
        if (cur_position>0){
        cur_position--;
        log('Back Arrow Clicked: ',' ');
        setFrame(cur_position);
        }
}


$(document.body).on('click', '.n_back' , function(e) {
    moveBack();
});

$(document.body).on('click', '.fullscreen' , function(e) {
goFull();
});

function goFull(){
if (ham_open){
hamlogic();
}
log('Entering Fullscreen Story Mode ',' ');
$("#storyframe").removeClass("sframe");
$("#title_frame").hide();
$("#frame").removeClass("framewidth");
$("#f_image").removeClass("sketchsize").addClass("fullsize");
$("#frametext").addClass("frametextfull");
$("#goFull").hide();
$("#goSmall").show();
$(".hamburger").hide();
$(".matrix").hide();
$("#NSE").hide();

isFull=true;
}

function goSmall(){
log('Exiting Fullscreen Story Mode ',' ');
$("#storyframe").addClass("sframe");
$("#title_frame").show();
$(".hamburger").show();
$("#frame").addClass("framewidth");
$("#f_image").removeClass("fullsize").addClass("sketchsize");
$("#frametext").removeClass("frametextfull");
$("#goFull").show();
$("#goSmall").hide();
$("#NSE").show();
$(".matrix").show();
isFull=false;
}

$(document.body).on('click', '.minimize' , function(e) {
goSmall();
});


/*Key Press Actions*/
document.addEventListener("keyup", function(e) {
        //if right arrow pressed
          if (e.key == 'ArrowRight') {
           if($("#storyframe").is(":visible")){
                    log('Right keyboard Button Clicked: ',' ');
                    moveForward();
           }
        }

        //if left arrow pressed
        if (e.key == 'ArrowLeft') {
            if($("#storyframe").is(":visible")){
                log('Left keyboard Button Clicked: ',' ');
                moveBack();
            }
        }

        //if t pressed hide text for story image
        if (e.key == 't') {
            if($("#frametext").is(":visible")){
                log('Hiding story text: ',' ');
                $("#frametext").hide();
            }
            else{
            log('Showing story text: ',' ');
            $("#frametext").show();
            }
        }

        //if f pressed toggle fullscreen
        if (e.key == 'f') {
            if(isFull){
               goSmall();
            }
            else{
               goFull();

            }
        }

        //if p pressed toggle download from pdf to ppt since SF removed username
          if (e.key == 'p') {
           if($('#dl_ppt').is(":visible")){
               log('PPT Download Link Hidden',' ');
               $('#dl_ppt').hide();
               $('#dl_pdf').show();
            }
            else{
              log('PPT Download Link Shown',' ');
              $('#dl_ppt').show();
              $('#dl_pdf').hide();
            }
        }


}, false);


/*Code to Dynamically play video*/
 var _video = document.getElementById("playvideo");
 var src='empty';
 var isVideoShowing =false;

/*On click play the video*/
$(document.body).on('click', '.showvideo' , function() {
log('Launch Video Button Pressed',$(this).attr('video-link'));
src = $(this).attr('video-link');
swapvideo();
showvideo();
_video.play();
isVideoShowing =true;
vid_name =src.substring(src.lastIndexOf('/') + 1);
log("Video showing", vid_name);
});

/*Code to close the video*/
$(document.body).on('click', '#c_video' , function() {
      //Pause the video
     _video.pause();
      //hide video region
     $("#blackout").hide();
     isVideoShowing =false;
} );

/*function swaps out video and poster for playing another*/
function swapvideo() {
//swap the core html
$('#playvideo').html('<source src="'+src+'" type="video/mp4"/>' +
'<p><br><br>' +'Your browser does not support the HTML 5 video. ' +
'<a href="'+src+'"> ' +'Try downloading the video instead from here.<\/a><\/p>');
$('#playvideo').on();
$('#playvideo').show();
}

/*Function to show video with blackout*/
function showvideo(){
   $("#blackout").fadeIn(400);
};

/*When video ends show the poster*/
_video.addEventListener('ended', function () {
_video.pause();
log("Video Ended", src);
_video.currentTime = 1;
}, false);




//Capture browser dimensions
log('Browser Dimensions: ', '  Width: '+$(window).width()+ '  Height: '+$(window).height());


});

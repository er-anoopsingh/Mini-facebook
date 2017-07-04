/*only execute when html dom is loaded*/
$(document).ready(function(){

  /******** -----(A)----- token input without ui ********/
  /*var facebookToken = "EAACEdEose0cBAGs7JB6Xemz9XAZCZARyA5wxKIeglsilhdZBRQuveqZC0oQtBCWvzPWypDuIaLZCq7fOq5RHUeFaBOdoAjCjreqeHj3mwVj5o6NEVEfEaz7DPPf5UCbq5D6MpDlnitFXwrR66Fg1et6PnEW132f3FwxcCios24X6YJ7wkcbW2YtYbCwcICwkZD";
  .ajax("https://graph.facebook.com/me?access_token=" + facebookToken, {

    success: function(response){
      showMyProfile(response);
    }

  });

  $.ajax("https://graph.facebook.com/me/feed?access_token=" + facebookToken, {

    success: function(response){
      showMyFeed(response);
    }

  }); end of -----(A)-----*/

/******** -----(B)----- token input from ui********/

  $("#myModal").modal('show'); // load modal when page loads
  $("#save").on("click", function () { // when save button is clicked

    var facebookToken = $("#inp-token").val();

    $.ajax("https://graph.facebook.com/me?access_token=" + facebookToken, {

      success: function(response){
        showMyProfile(response);
      },
      error:  function (request, status, error) {
        $("#inp-token").val(""); // to clear modal input for user to simply paste token instead of deletion and insertion
        console.log("Please enter a valid token");
      }

    });

    $.ajax("https://graph.facebook.com/me/feed?access_token=" + facebookToken, {

      success: function(response){
        showMyFeed(response);
      },
      error:  function (request, status, error) {
         if (status == "timeout") {
           alert("Timeout please check your connection and refresh the page");
         }
        alert("Please enter a valid token");
    }

    });

    $("#inp-token").val(""); // to clear modal input for user to simply paste token instead of deletion and insertion
  }); // end of -----(B)-----



}); // end of ready function

/**function called to show basic information about the person if ajax request is successful
  *response- a json object returned by facebook graph api on successful request
  *return - Appends the content to selectors
  **/
  function showMyProfile(response){


    var userId = response.id; //saving userid for accessing their profile picture
    pictureUrl = "https://graph.facebook.com/"+ userId + "/picture?type=large"; //saving url of profile picture of user

    $("img#profile").attr("src",pictureUrl); //displaying profile picture
    setField( $("h2#full-name"), response.first_name); //displaying first name of user
    setField( $("h2#full-name"), response.last_name); //displaying last name of user
    setField( $("p#info"), response.birthday, "Birthday: "); //displaying birthday of user
    $("p#info").append("<br />"); //adding a line break to append new information from next line
    setField( $("p#info"), response.email, "Email: "); //displaying email of user
    $("p#info").append("<br />");
    setField( $("p#info"), response.gender, "Gender: "); //displaying gender of user
    $("p#info").append("<br />");
    setField( $("p#info"), response.location.name, "Current place: "); //displaying current city of user
    $("a#visit-profile").attr("href",response.link);

    setField( $("div#right-side h2#work"),response.work,"WORK");
    if($("div#right-side h2#work").text() == "WORK"){    //to only access details of work object if it is present
      setWork( $("div#fb-work"),response.work);
    }


    setField( $("div#right-side h2#edu"),response.work,"EDUCATION");
    if($("div#right-side h2#edu").text() == "EDUCATION"){
      setEdu( $("div#fb-edu"),response.education);
    }

  }



/**utility function to check whether the accessed field is defined or not and append it to the selector
  *selector- jquery selector to identify the html element
  *field - a key in an object
  *str - a string containting a defining text for element to be appended
  *return - the same selector as input for further use after appending the field value
  **/
function setField(selector,field,str){
  if(str == undefined){
    str = "";
  }
  if((field instanceof Array) || (field instanceof Object) ){ // don't append field value if it's an array or object
    selector.append(str);
    return selector;
  }
  if(field == undefined){ // if the field is undefined then simply return the selector
    return selector;
  }
  else{
    selector.append("<b>" + str + "</b>" + " " + field); // append the field value to selector
    return selector;
  }
}


/**utility function to check whether the accessed field has elements in it or not and append it to the selector
  *selector- jquery selector to identify the html element
  *workArray - an array containing work objects
  *return - the same selector as input for further use after appending the array contents
  **/
function setWork(selector,workArray){

  if(workArray == undefined){ // if the field is undefined then simply return the selector
    return selector;
  }
  else{

    workArray.map(function(eachWork){ // for each object in array
      var content = ""; //empty string to create html string
      if(eachWork.hasOwnProperty("employer")){ //check whether object has the property
        content += "<b>Company: </b>" + " " + eachWork.employer.name + "<br/>";
      }
      if(eachWork.hasOwnProperty("location")){ //check whether object has the property
          content += "<b>Location: </b>" + " " + eachWork.location.name;
      }
      selector.append("<p>" + content); // append the formatted string to selector
    })
    return selector;
  }
}


/**utility function to check whether the accessed field has elements in it or not and append it to the selector
  *selector- jquery selector to identify the html element
  *eduArray - an array containing education objects
  *return - the same selector as input for further use after appending the array contents
  **/
function setEdu(selector,eduArray){

  if(eduArray == undefined){ // if the field is undefined then simply return the selector
    return selector;
  }
  else{
    eduArray.map(function(eachEdu){ // for each object in array
      var content = ""; //empty string to create html string
      if(eachEdu.hasOwnProperty("school")){  //check whether object has the property
        content += "<b>School: </b>" + " " + eachEdu.school.name;
      }
      selector.append("<p>" + content); // append the formatted string to selector
    })
    return selector;
  }
}

/**function to show all the posts from the user feed
  *response- an object containing array of data
  *return - shows 5 posts at a time and loads 5 more when user clicks load more button
  **/
function showMyFeed(response) {

  var begPostidx = 0; // beginning index for data array
  var endPostidx = 5; // end index for data array

/*if array is empty that means no posts have been created by user*/
  if( response.data[0].length == 0 ){
    $("div#post").append("No posts yet");
    return ;
  }

 else{

   if(endPostidx > response.data.length){ // if array of posts is less than 5 items then make the end index equal to length of array
     endPostidx = response.data.length;
   }
   limitResponse = response.data.slice(begPostidx, endPostidx)
   showLimitedPosts(limitResponse); // function call to show 5 or less posts at a time

   /*when user clicks on load more button take next 5 posts or less and display it*/
   $("div#myfeed").on("click", ".btn-center", function(){
     begPostidx = endPostidx;

     if(begPostidx >= response.data.length){  // if no more posts are there then remove load more button and display a message

       $("div#myfeed button").parent().remove();
        $("div#myfeed").append("<div class='row' id='feed'><div class='col-md-3 col-xs-12'></div><div class='col-md-8 col-xs-12' id='post'>\
        <h3>End of your feed</h3><hr></div></div>");
       return;
     }

     else if(endPostidx + 5 < response.data.length){ // take next 5 items
       endPostidx += 5;
     }
     else{
       endPostidx = response.data.length; // if items are less than 5 then take those as input
     }

     $("div#myfeed button").parent().remove();   // to remove button and also whitespace left by it when user clicks
     limitResponse = response.data.slice(begPostidx, endPostidx)
     showLimitedPosts(limitResponse);
   });
  }
}// end of showMyFeed


/**function to show 5 posts at a time when load more button is clicked
  *response- an array of 5 posts
  *return - appends posts content to a div and at the end appends a load more button
  **/
function showLimitedPosts(response){

  /* html to format the posts displayed*/
    var startFormatContent = "<div class='row' id='feed'><div class='col-md-3 col-xs-12'></div><div class='col-md-8 col-xs-12' id='post'>";
    var endFormatContent = "<hr></div></div>";

    var content = "";  // empty string to store the whole div before adding it to html
    response.map(function(eachPost){
      content = "";
      var userId = eachPost.from.id; //saving userid for accessing their profile picture
      pictureUrl = "https://graph.facebook.com/"+ userId + "/picture?type=large"; //saving url of profile picture of user
      switch (eachPost.type) { // for checking which type of post user posted
        case "status":
                  content += startFormatContent;
                  content += "<img class='feed-img' id='feed-img-id' src='" + pictureUrl + "' alt='pic'>";
                  content += "<p class='feed-img'> " + eachPost.from.name + "</p>";
                  content += "<p class='feed-img time'>" + dateFormat(eachPost.created_time) + "</p>";
                  content += "<p class='format-msg'>" + checkMessage(eachPost.message) + "</p>";
                  content += "<p class='feed-img'> " + checkMessage(eachPost.story) + "</p>";
                  content += endFormatContent;
                  $("div#myfeed").append(content);
                  break;

        case "photo":
                  content += startFormatContent;
                  content += "<img class='feed-img' id='feed-img-id' src='" + pictureUrl + "' alt='pic'>";
                  content += "<p class='feed-img'> " + eachPost.from.name + "</p>";
                  content += "<p class='feed-img time'>" + dateFormat(eachPost.created_time) + "</p>";
                  content += "<p class='format-msg'>" + checkMessage(eachPost.message) + "</p>";
                  content += "<img src='" + eachPost.picture + "' class='post-img' alt='post pic'>";
                  content += endFormatContent;
                  $("div#myfeed").append(content);
                  break;

        case "video":
                  content += startFormatContent;
                  content += "<img class='feed-img' id='feed-img-id' src='" + pictureUrl + "' alt='pic'>";
                  content += "<p class='feed-img'> " + eachPost.from.name + "</p>";
                  content += "<p class='feed-img time'>" + dateFormat(eachPost.created_time) + "</p>";
                  content += "<p class='format-msg'>" + checkMessage(eachPost.message) + "</p>";
                  content += "<video width='240' height='180' controls><source src='" + eachPost.source +"' type='video/mp4'></video>";
                  content += endFormatContent;
                  $("div#myfeed").append(content);
                  break;

        case "link":
                  content += startFormatContent;
                  content += "<img class='feed-img' id='feed-img-id' src='" + pictureUrl + "' alt='pic'>";
                  content += "<p class='feed-img'> " + eachPost.from.name + "</p>";
                  content += "<p class='feed-img time'>" + dateFormat(eachPost.created_time) + "</p>";
                  content += "<p class='format-msg'>" + checkMessage(eachPost.message) + "</p>";
                  content += "<a href='" + eachPost.link + "'class='format-msg' style='text-decoration: underline' \
                              target='_blank'><b>" + checkMessage(eachPost.name) + "</b></a>";
                  content += "<p class='format-msg'>" + checkMessage(eachPost.description) + "</p>";
                  content += endFormatContent;
                  $("div#myfeed").append(content);
                  break;

        default:
                  break;
      }

    });

    /*to style and append load more button*/
    content = "";
    content += "<div class='row' id='feed'><div class='col-md-3 col-xs-12'></div><div class='col-md-8 col-xs-12' id='post'\
                style='background-color: transparent; box-shadow: none'>";
    content += "<button class='btn btn-primary btn-center'>Load More</button>";
    content += endFormatContent;
    $("div#myfeed").append(content);

  } // end of showLimitedPosts function


  /**utility function to format the date before displaying it in posts
    *inputDate- date string in response object
    *return - date in a readable format
    **/
  function dateFormat(inputDate) {
    var parsedDate = Date.parse(inputDate);
    date = new Date(parsedDate);
    constructDate = date.toDateString() + " " + date.getHours() + ":" + date.getMinutes();
    return constructDate;
  }


  /**utility function to check whether the content displayed is present or not
    *inputMsg- any string in response object
    *return - empty string if input is undefined and returns the string if present
    **/
  function checkMessage(inputMsg) {
    if(inputMsg == undefined){
      return "";
    }
    else{
      return inputMsg;
    }
  }

/* 1. Search */


var UI = {};

UI.SubmitClick = function(){
    document.querySelector(".js-submit").addEventListener('click',function(){
        var input = document.querySelector(".input-search").value;
        SoundCloudAPI.getTrack(input);
 });
};

UI.EnterPress = function(){
    document.querySelector(".js-search").addEventListener('keyup',function(e){
    var input = document.querySelector(".input-search").value; //or .className
    
    // if the key is ENTER
    if(e.which === 13){
    SoundCloudAPI.getTrack(input);
    }
    
 });
};

/* Reset */
UI.ResetList = function(){
    document.querySelector(".reset").addEventListener('click',function(){
        localStorage.removeItem("key");
        window.location.reload();
    }
)};

UI.SubmitClick();
UI.EnterPress();
UI.ResetList();

/* 2. Query Soundcloud API */

var SoundCloudAPI = {};
/* wrap init into object's method */
SoundCloudAPI.init = function(){
    
    SC.initialize({
      client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
    });
    
}

/* call init method */
SoundCloudAPI.init();

/* wrap getTrack into object's method */
SoundCloudAPI.getTrack = function(inputValue) {
    
    // find all sounds of buskers licensed under 'creative commons share alike'
    SC.get('/tracks', {
      q: inputValue
    }).then(function(tracks) {
      // promise if -> then
      SoundCloudAPI.renderTracks(tracks);
    });
    
}


/* 3. Display Cards */

/* create render method */
SoundCloudAPI.renderTracks = function(tracks) {

var searchResults = document.querySelector(".js-search-results");

// clear previous search results results
searchResults.innerHTML = ("");
    
tracks.forEach(function(track){
    
    console.log(track);
    
    // card
    var card = document.createElement("div");
    card.classList.add("card");
        
    // image
    var imageDiv = document.createElement("div");
    imageDiv.classList.add("image");
    
    // image img
    var imageImg = document.createElement("img");
    imageImg.classList.add("image_img");
    imageImg.src = track.artwork_url || "http://lorempixel.com/200/200/";
    
    // content
    var content = document.createElement("div");
    content.classList.add("content");
    
    // content header
    var header = document.createElement("div");
    header.classList.add("header");
    header.innerHTML = '<a href="' + track.permalink_url + '" target="_blank">' + track.title + '</a>';
    
    // button
    var button = document.createElement("div");
    button.classList.add("ui", "bottom", "attached", "button", "js-button");
    
    // button's icon
    var icon = document.createElement("i");
    icon.classList.add("add", "icon");
    
    // span text inside button
    var details = document.createElement("span");
    details.innerHTML = "Add to playlist";
    
    //append stuff
    searchResults.appendChild(card);
    card.appendChild(imageDiv);
    card.appendChild(content);
    card.appendChild(button);
    imageDiv.appendChild(imageImg);
    content.appendChild(header);
    button.appendChild(icon);
    button.appendChild(details);
    
    button.addEventListener('click', function(){
      SoundCloudAPI.getEmbed(track.permalink_url);
    });
        
    
}); /* forEach end */
}




/* 4. Add to playlist and play */
/* addmethod */
SoundCloudAPI.getEmbed = function(trackURL){
    SC.oEmbed(trackURL, {
      auto_play: false
    }).then(function(embed){
        console.log('oEmbed response: ', embed);
        var sideBar = document.querySelector(".js-playlist");
        
        var box = document.createElement("div");
        box.innerHTML = embed.html;
        
        sideBar.insertBefore(box, sideBar.firstChild);
        localStorage.setItem("key", sideBar.innerHTML);     
    });
}

var sideBar = document.querySelector(".js-playlist");
sideBar.innerHTML = localStorage.getItem("key");

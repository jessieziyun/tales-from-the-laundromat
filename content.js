let canvas_container;
const placeholder_video_id = '-wQJl__SfS8';
let content_container;
let quote;

const vid_id = {
  bowwash: '-wQJl__SfS8'
}

let laundrette;

let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player;

function onYouTubeIframeAPIReady() {
  canvas_container = document.getElementById("canvas-container");
  // console.log(canvas_container);
  // canvas_container.addEventListener("p5loaded", () => {
  console.log("yt player initialised");
  const vidWidth = 800;
  const vidHeight = vidWidth * 9 / 16;
  player = new YT.Player('player', {
    height: vidHeight,
    width: vidWidth,
    videoId: placeholder_video_id,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  // });
}

function onPlayerReady(event) {
  canvas_container.addEventListener("iconclicked", () => {
    console.log('playing video for: ' + laundrette_name);

    //if the play icon is clicked, load the video of the associated laudrette
    laundrette = vid_id[laundrette_name];
    if (laundrette != '') {
      player.loadVideoById(laundrette);
    } else {
      player.loadVideoById(placeholder_video_id); //play placeholder if no associated video is found
      console.warn("no video found. playing placeholder video.")
    }
    video_active = true;
    content_container = document.getElementById("content-container");
    content_container.style.display = "block"; //display the video player

    $(".exit-player").click(
      () => {
        $("#content-container").css({
          "display": "none"
        });
        player.stopVideo(); //stop the video
        video_active = false;
      },
    );
  }, false);
}

function toggleVisibility(div) {
  div.style.display === "block" ?
    div.style.display = "none" :
    div.style.display = "block";
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    let ifr = player.getIframe()
    toggleVisibility(ifr);
    video_active = false;
  }
}

function changeQuote(laundrette){

  $( ".quote" ).text( `${quote}` );
}
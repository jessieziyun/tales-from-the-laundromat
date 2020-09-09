let canvas_container, content_container;
let laundrette;
let audio_player;
let quote;
const audio_embed_start = "https://audiomack.com/embed/song/kjy-1/";
const audio_embed_end = "?background=1";
const placeholder_video_id = '-wQJl__SfS8';

const vid_id = {
  bowwash: '-wQJl__SfS8'
}

const audio_id = {
  bare: "clare-bare-laundertte-morcambe",
  brilliant: "its-brilliant-mainwise-with-charlie-nottingham",
  cityroad: "janice-city-road-laundry-sheffield",
  tumble: "tumble-wash-laundry-services-stafford-donna",
  dizzydolly: "dizzy-dolly-launderette-jan",
  clockwash: "clockwash-launderette-matthew",
  washdry: "the-wash-and-dry-shop-dui-0190",
  southparade: "south-parade-oxford-interview-with-ed",
  traga: "debbie-traga-landerette",
  bedknobs: "bednobsjilly",
  cornwallfa: "vicky-cornwall-fa",
  blackness: "the-blackness-launderette"
}

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
  player = new YT.Player('video-player', {
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
  canvas_container.addEventListener("videoiconclicked", () => {
    console.log('playing video for: ' + laundrette_name);
    $("#video-player").css({
      "display": "block"
    });
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
        $("#video-player").css({
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

function playAudio() {
  canvas_container.addEventListener("audioiconclicked", () => {
    console.log('playing audio for: ' + laundrette_name);
    audio_player = document.getElementById("audio-player");
    laundrette = audio_id[laundrette_name]
    audio_player.src = audio_embed_start + laundrette + audio_embed_end;
    $("#audio-player").css({
      "display": "block"
    });
    content_container = document.getElementById("content-container");
    content_container.style.display = "block"; //display the audio player

    $(".exit-player").click(
      () => {
        $("#content-container").css({
          "display": "none"
        });
        $("#audio-player").css({
          "display": "none"
        });
      },
    );
  }, false);
}
function changeQuote(laundrette){

  $( ".quote" ).text( `${quote}` );
}
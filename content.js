let canvas_container, content_container;
let mobile;
let laundrette;
let audio_player;
let flex_container;
const audio_embed_start = "https://audiomack.com/embed/song/kjy-1/";
const audio_embed_end = "?background=1";
const placeholder_video_id = "-wQJl__SfS8";

const vid_id = {
  bowwash_tim: "-wQJl__SfS8",
  bowwash_jv: "dtlxzanFO8A",
  super_merlyn: "l9yEaqeavsk",
  super_ikey: "vOcdMM4ZaDg",
  northmoor: "r8wcICG70dI",
  cleanbean_samia: "u_38zZbK8eA",
  cleanbean_nuala: "Zobqf4O6s3g"
};

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
  blackness: "the-blackness-launderette",
  laura: "laura-g-went-to-the-launderette-in-south-london",
  townend: "townend-launderette-john",
};

let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player;

function onYouTubeIframeAPIReady() {
  canvas_container = document.getElementById("canvas-container");

  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  function isiOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function isMobile() {
    return isAndroid() || isiOS();
  }

  mobile = isMobile();
  console.log("yt player initialised, mobile: " + mobile);

  let vidWidth;
  let vidHeight;

  if (!mobile) {
    vidWidth = 900;
    vidHeight = (vidWidth * 9) / 16;
  }
  if (mobile) {
    vidWidth = 400;
    vidHeight = (vidWidth * 9) / 16;
  }

  player = new YT.Player("video-player", {
    height: vidHeight,
    width: vidWidth,
    videoId: placeholder_video_id,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  console.log("player ready");
  canvas_container.addEventListener(
    "videoiconclicked",
    () => {
      console.log("playing video for: " + laundrette_name);
      $("#video-player").css('display', 'block');
      //if the play icon is clicked, load the video of the associated laudrette
      laundrette = vid_id[laundrette_name];
      if (laundrette != "") {
        player.loadVideoById(laundrette);
      } else {
        player.loadVideoById(placeholder_video_id); //play placeholder if no associated video is found
        console.warn("no video found. playing placeholder video.");
      }
      video_active = true;
      content_container = document.getElementById("content-container");
      content_container.style.display = "block"; //display the video player
      $("#map-home").css('display', 'none');
      $("#exit-player").click(() => {
        $("#content-container").css('display', 'none');
        $("#video-player").css('display', 'none');
        $("#map-home").css('display', 'block');
        player.stopVideo(); //stop the video
        video_active = false;
      });
    },
    false
  );
}

function toggleVisibility(div) {
  div.style.display === "block" ?
    (div.style.display = "none") :
    (div.style.display = "block");
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    let ifr = player.getIframe();
    toggleVisibility(ifr);
    video_active = false;
  }
}

function playAudio() {
  canvas_container.addEventListener(
    "audioiconclicked",
    () => {
      console.log("playing audio for: " + laundrette_name);
      audio_player = document.getElementById("audio-player");
      laundrette = audio_id[laundrette_name];
      audio_player.src = audio_embed_start + laundrette + audio_embed_end;
      $("#audio-player").css('display', 'block');
      $("#map-home").css('display', 'none');
      content_container = document.getElementById("content-container");
      content_container.style.display = "block"; //display the audio players
      $("#exit-player").click(() => {
        $("#content-container").css('display', 'none');
        $("#audio-player").css('display', 'none');
        $("#map-home").css('display', 'block');
      });
    },
    false
  );
}

function displayText() {
  canvas_container.addEventListener(
    "texticonclicked",
    () => {
      $("#launderette-story").html(`<h2>${story}</h2>`);
      $("#launderette-story").css('display', 'block');
      $("#content-container").css('display', 'block');
      $("#map-home").css('display', 'none');
      $("#exit-player").click(() => {
        $("#content-container").css('display', 'none');
        $("#launderette-story").css('display', 'none');
        $("#map-home").css('display', 'block');
      });
      $("#content-home").click(() => {
        $("#launderette-story").css('display', 'none');
      });
    },
    false
  );
}
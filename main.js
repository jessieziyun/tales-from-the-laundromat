let map;
let mobile;
let canvas;
let canvasHeight;
let areas, icons;
let areaLabel, locationLabel, durationLabel;
let nextCommand;
let laundrette_name;
let video_active;
let quote;
let font;

const mapWidth = 4000;
const mapHeight = 5000;

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isiOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
    return isAndroid() || isiOS();
}

function toggleLandingPage() {
    $(document).ready(() => {
        $('.logo').click(
            () => {
                $('.entry').css({
                    "display": "none"
                });
            },
        );
    });
}


function toggleLandingPage() {
    $(document).ready(() => {
        $('.logo').click(
            () => {
                $('.entry').css({
                    "display": "none"
                });
            },
        );
        $('.hamburger-icon').click(
            () => {
                $('.about').css({
                    "display": "block"
                });
                $('.hamburger-icon').css({
                    "display": "none"
                });
            },
        );
        $('.x-icon').click(
            () => {
                $('.about').css({
                    "display": "none"
                });
                $('.hamburger-icon').css({
                    "display": "block"
                });
            },
        );
    });
}

function preload() {
    areas = loadImage("assets/areas.png");
    icons = loadImage("assets/uk.jpg");
    // font = loadFont(FONT_FILE);
    console.log("preload complete");
}

function setup() {
    mobile = isMobile();
    areaLabel = "";
    locationLabel = "";
    durationLabel = "";

    if (mobile) {
        console.log("mobile");
    }
    canvasHeight = floor(windowWidth * mapHeight / mapWidth);
    canvas = createCanvas(windowWidth, canvasHeight);
    canvas.mouseReleased(canvasReleased);
    canvas.parent("canvas-container");
    areas.resize(windowWidth, 0);
    icons.resize(windowWidth, 0);
    image(icons, 0, 0);
    toggleLandingPage();
    playAudio();
}

function draw() {
    image(icons, 0, 0);
    textFont('Arial', 26);
    textAlign(LEFT, BASELINE);
    textStyle(BOLD);
    textLeading(30);
    // fill('#f7f5c2');

    let xPos;
    let text_width;
    let l_name = textWidth(areaLabel);
    let media_duration = textWidth(durationLabel) + 30; 

    l_name > media_duration
    ? (text_width = l_name)
    : (text_width = media_duration);

    mouseX + text_width > width
    ? (xPos = width - text_width + 20)
    : (xPos = mouseX + 20);

    fill(100);
    text(areaLabel, xPos, mouseY + 30);
    text(locationLabel, xPos, mouseY + 90);
    text(durationLabel, xPos, mouseY + 120);
}

function mouseMoved() {

    if (areas != null) {

        var c = areas.get(mouseX, mouseY);

        if (alpha(c) != 0) {
            let command = getCommand(c);
            if (command != null)
                if (command.label != null) 
                    areaLabel = command.label;{
                    locationLabel = command.location;
                    durationLabel = "Media duration: " + command.duration;
                    quote = command.quote;
                    $(".quote").text(`"${quote}"`);
                    quote != ""
                    ? $(".quote").css({"display": "block"})
                    : $(".quote").css({"display": "none"});
                }
        }
        if (alpha(c) == 0) {
            areaLabel = "";
            locationLabel = "";
            durationLabel = "";
            $(".quote").css({
                "display": "none"
              });
        }
    }
}

function getCommand(c) {
    try {
        //turn color into string
        var cString = color(c).toString("#rrggbb"); //for com

        var areaColours = LAUNDERETTES.areaColours;
        var command;

        //go through properties
        for (var colourId in areaColours) {

            if (areaColours.hasOwnProperty(colourId)) {
                var aString = "#" + colourId.substr(1);

                if (aString == cString) {
                    //color found
                    command = areaColours[colourId];
                }
            }
        }
    } catch (e) {
        console.log("Get command error, colour: " + c);
        console.error(e);
    }
    return command;
}

function executeCommand(c) {
    areaLabel = "";
    switch (c.cmd) {
        case "video":
            if (c.laundrette != null) {
                laundrette_name = c.laundrette;
                let video_event = new Event("videoiconclicked", {
                    bubbles: true
                });
                canvas_container.dispatchEvent(video_event);
            } else print("Video did not work :(");
            break;
        case "audio":
            if (c.laundrette != null) {
                laundrette_name = c.laundrette;
                let audio_event = new Event("audioiconclicked", {
                    bubbles: true
                });
                canvas_container.dispatchEvent(audio_event);
                console.log("laundrette name: " + laundrette_name);
            } else print("Audio did not work :(");
            break;
    }
}

var touchDown = false;

function mouseDragged() {
    mouseMoved();
}

function touchMoved() {
    mouseMoved();
    touchDown = true;
}

function touchEnded() {

    if (touchDown) {
        touchDown = false;
        canvasReleased();
    }
}

function canvasReleased() {
    if (areas != null) {
        var c = areas.get(mouseX, mouseY);
            var command = getCommand(c);
            if (command != null) {
                executeCommand(command);
                nextCommand = null;
            }
    }
}

function windowResized() {
    canvasHeight = floor(windowWidth * mapHeight / mapWidth);
    resizeCanvas(windowWidth, canvasHeight);
    icons.resize(windowWidth, 0);
    areas.resize(windowWidth, 0);
    image(icons, 0, 0);
  }
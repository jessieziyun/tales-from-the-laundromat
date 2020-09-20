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
const FONT_FILE = "assets/SpaceMono-Regular.ttf";

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
    font = loadFont(FONT_FILE);
    console.log("preload complete");
}

function setup() {
    mobile = isMobile();
    areaLabel = "";
    locationLabel = "";
    durationLabel = "";

    if (mobile) {
        console.log("mobile");
        $('#flex').css('width', '350px');
        $('h2').css('font-size', '18px');
        $('h1').css('font-size', '12px');
        $('.left').css('left', '-100px');
        $('.right').css('right', '-100px');
        $('.about-text').css('width', '350px');
        $('.hamburger-icon').css({'right': '15px', 'top': '20px'});
        $('.x-icon').css({'right': '15px', 'top': '20px'});
        $('.mobile').css('display', 'block');
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
    textFont(font, 16);
    textAlign(LEFT, BASELINE);
    fill('#fff15f');
    text(areaLabel, mouseX+ 20, mouseY + 20);
    text(locationLabel, mouseX + 20, mouseY + 40);
    text(durationLabel, mouseX + 20, mouseY + 60);
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
                }
        }
        if (alpha(c) == 0) {
            areaLabel = "";
            locationLabel = "";
            durationLabel = "";
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
                quote = c.quote;
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
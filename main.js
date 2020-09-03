let mobile;
let canvas;
let canvasHeight;
let areas;
let areaLabel;
let nextCommand;
let laundrette_name;
let video_active;

const mapWidth = 730;
const mapHeight = 701;

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
        $('.back').click(
            () => {
                $('.entry').css({
                    "display": "block"
                });
            },
        );
    });
}

function preload() {
    areas = loadImage("assets/area.png");
    console.log("preload complete");
}

function setup() {
    mobile = isMobile();
    if (mobile) {
        console.log("mobile");
        /*
        let logo = document.getElementsByClassName("logo")[0];
        console.log(logo);
        if(logo !== undefined){
            logo.style.width = "200";
            
        }
        */
    }
    canvasHeight = floor(windowWidth * mapHeight / mapWidth);
    canvas = createCanvas(windowWidth, canvasHeight);
    canvas.mouseReleased(canvasReleased);
    canvas.parent("canvas-container");
    areas.resize(windowWidth, 0);
    image(areas, 0, 0);
    toggleLandingPage();
}

function mouseMoved() {

    if (areas != null) {

        var c = areas.get(mouseX, mouseY);

        if (alpha(c) != 0) {
            let command = getCommand(c);
            if (command != null)
                if (command.label != null) {
                    areaLabel = command.label;
                    // console.log(areaLabel);
                }
            // console.log(command);
            // console.log(c);
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
    // print("Executing command " + c.cmd);
    switch (c.cmd) {
        case "video":
            if (c.laundrette != null) {
                laundrette_name = c.laundrette;
                var event = new Event("iconclicked", {
                    bubbles: true
                });
                canvas_container.dispatchEvent(event);
                // console.log("laundrette name: " + laundrette_name);
            } else print("Video did not work :(");
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
    // print("CLICK " + mouseButton);
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
    areas.resize(windowWidth, 0);
    image(areas, 0, 0);
  }
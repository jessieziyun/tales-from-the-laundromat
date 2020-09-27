let map;
let canvas;
let canvasHeight;
let areas, icons;
let nameLabel, areaLabel, locationLabel, durationLabel;
let nextCommand;
let laundrette_name;
let video_active;
let contentdisplay;
let quote;

const mapWidth = 1000;
const mapHeight = 1250;

function toggleLandingPage() {
    $(document).ready(() => {
        $("#logo-image").click(() => {
            $(".entry").css({
                display: "none"
            });
            $("#content-container").css({
                display: "none"
            });
        });
        $(".hamburger-icon").click(() => {
            $(".about").css({
                display: "block"
            });
            $(".hamburger-icon").css({
                display: "none"
            });
        });
        $(".x-icon").click(() => {
            $(".about").css({
                display: "none"
            });
            $(".hamburger-icon").css({
                display: "block"
            });
        });
        $("#homepage").click(() => {
            $(".entry").css({
                display: "block"
            });
        });
    });
}

function preload() {
    areas = loadImage("assets/areas.png");
    icons = loadImage("assets/map.jpg");
    console.log("preload complete");
}

function setup() {
    nameLabel = "";
    areaLabel = "";
    locationLabel = "";
    durationLabel = "";

    if (mobile) {
        console.log("p5 setup, mobile");
        $(".main").css({
            top: "100px"
        });
        $(".audio-player").css({
            width: "400px"
        });
        $(".exit-player").css({
            width: "375px"
        });
    }

    canvasHeight = floor((windowWidth * mapHeight) / mapWidth);
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

    contentdisplay = $('#content-container').css("display");

    if (!mobile && contentdisplay == "none") {
        image(icons, 0, 0);
        textFont("Arial", 20);
        textAlign(LEFT, BASELINE);
        textStyle(BOLD);
        textLeading(30);

        let xPos;
        let text_width;
        let l_name = textWidth(areaLabel);
        let media_duration = textWidth(durationLabel) + 30;

        l_name > media_duration ?
            (text_width = l_name) :
            (text_width = media_duration);

        mouseX + text_width > width ?
            (xPos = width - text_width + 20) :
            (xPos = mouseX + 20);

        if (nameLabel != "") {
            fill('#13a46c');
            noStroke();
            rect(xPos - 20, mouseY, text_width + 35, 110);
        }

        fill('#faecda');
        text(nameLabel, xPos, mouseY + 30);
        text(areaLabel, xPos, mouseY + 50);
        text(locationLabel, xPos, mouseY + 70);
        text(durationLabel, xPos, mouseY + 90);
    }
}

function mouseMoved() {
    if (areas != null) {
        var c = areas.get(mouseX, mouseY);

        if (alpha(c) != 0) {
            document.body.style.cursor = "pointer";
            let command = getCommand(c);
            if (command != null) {
                if (command.name != null) {
                    nameLabel = command.name;
                }
                if (command.label != null) {
                    areaLabel = command.label;
                }
                if (command.location != null) {
                    locationLabel = command.location;
                }
                if (command.duration != null) {
                    durationLabel = "Media duration: " + command.duration;
                }
                if (command.quote != null) {
                    quote = command.quote;
                }
                if (!mobile) {
                    $(".quote").text(`"${quote}"`);
                    if (quote != "" && contentdisplay == "none") {
                        $(".quote").css({
                            display: "block"
                        })
                    } else {
                        $(".quote").css({
                            display: "none"
                        });
                    }
                }
            }
        }
        if (alpha(c) == 0) {
            document.body.style.cursor = "auto";
            nameLabel = "";
            areaLabel = "";
            locationLabel = "";
            durationLabel = "";
            $(".quote").css({
                display: "none"
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
    nameLabel = "";
    areaLabel = "";
    locationLabel = "";
    durationLabel = "";

    if (c.laundrette != null) {
        laundrette_name = c.laundrette;
    }

    if (c.images != null) {
        let numberOfImages = c.images;

        $("#gallery").empty();

        for (let i = 0; i < numberOfImages; i++) {
            $('#gallery').prepend($('<img>', {
                class: 'image',
                src: `assets/gallery/${laundrette_name}${i+1}.jpg`
            }));
        }
    }

    switch (c.cmd) {
        case "video":
            console.log("video");
            let video_event = new Event("videoiconclicked", {
                bubbles: true
            });
            canvas_container.dispatchEvent(video_event);
            console.log("video event");
            break;
        case "audio":
            let audio_event = new Event("audioiconclicked", {
                bubbles: true
            });
            canvas_container.dispatchEvent(audio_event);
            console.log("laundrette name: " + laundrette_name);
            break;
        case "txt":
            console.log("text");
            text = c.text;
            $("#launderette-story").css({
                display: "block"
            });
            $("#launderette-story").html(`<h2>${text}</h2>`);
            $("#content-container").css({
                display: "block"
            });
            $(".exit-player").click(() => {
                $("#content-container").css({
                    display: "none"
                });
                $("#launderette-story").css({
                    display: "none"
                });
            });
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
    canvasHeight = floor((windowWidth * mapHeight) / mapWidth);
    resizeCanvas(windowWidth, canvasHeight);
    icons.resize(windowWidth, 0);
    areas.resize(windowWidth, 0);
    image(icons, 0, 0);
}
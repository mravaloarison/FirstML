// declare variables
const importIn = document.getElementById("import-in");
const detectBtn = document.getElementById("detect-btn");
const msg = document.querySelectorAll(".msg");
let importedImg = document.getElementById("imported-img");


// display imported image
function displayImportedImg() {
    //  enable detect btn
    detectBtn.classList.remove("disabled");

    // go inside of the div with class imported-img and delete all the div inside of
    const highlighterElements = document.querySelectorAll(".highlighter");
    const pElements = document.querySelectorAll(".p");
    
    // remove previous detection
    // Loop through the NodeList and remove the "highlighter" class from each element
    highlighterElements.forEach(element => {
      element.remove();
    });

    pElements.forEach(element => {
        element.remove();
    });

    msg.forEach(element => {
        element.innerText = "";
        element.classList.add("hidden");
    });


    importedImg.classList.remove("hidden");

    const reader = new FileReader();
    reader.onload = function(event) { 
        importedImg.src = event.target.result;
    };
    reader.readAsDataURL(importIn.files[0]);
}

// When a pic is uploaded, display it
importIn.addEventListener("change", displayImportedImg);

// detect object
function detectObj() {

    // Load the model
    cocoSsd.load().then(model => {
        // detect objects in the image.
        model.detect(importedImg).then(predictions => {

            // get the ones higher than 80% of probability
            found = predictions.filter(modelObj => modelObj.score > 0.55);

            if (found.length > 0) {
                found.map(objDetected => {
                    // show the object detected
                    const p = document.createElement("p");
                    p.setAttribute("class", "p");

                    const highlighter = document.createElement("div");
                    highlighter.setAttribute("class", "highlighter");

                    highlighter.style.left = objDetected.bbox[0] + "px";
                    highlighter.style.top = objDetected.bbox[1] + "px";
                    highlighter.style.width = objDetected.bbox[2] + "px";
                    highlighter.style.height = objDetected.bbox[3] + "px";

                    const score = Math.round(parseFloat(objDetected.score) * 100);
                    p.innerText = score + "% " + objDetected.class;

                    p.style = 'margin-left: ' + objDetected.bbox[0] + 'px; margin-top: '

                    + (objDetected.bbox[1] - 10) + 'px; width: fit-content; top: 0; left: 0;';

                    document.querySelector(".imported-img").appendChild(highlighter);
                    document.querySelector(".imported-img").appendChild(p);
                });
            }

            else {
                msg.forEach(element => {
                    element.innerHTML = "⚠️ No object recognized, please try another picture.";
                    element.classList.remove("hidden");
                })
            }
        });
    });

    // disable btn
    detectBtn.classList.add("disabled");
    
}


detectBtn.onclick = detectObj;
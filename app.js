const myApp = document.getElementById("app");
const imgInput = document.getElementById("img-input"); 
let shouldContinuePrediction = true;
let objectClass = [];

// Check if webcam access is supported.
function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}

// if the webcam is supported
// add function for the startML btn on click
getUserMediaSupported ? 
document.getElementById("startML").addEventListener("click", startMLFunction) :
console.warn('getUserMedia() is not supported by your browser');


// Create new Classification Function
function newClassification() {
    // Create the button element
    const startMLButton = document.createElement('button');
    startMLButton.id = 'startML';
    startMLButton.className = '';
    startMLButton.textContent = 'Start 007ML';

    // Create the video element
    const videoElement = document.createElement('video');
    videoElement.id = 'webcam';
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.className = 'hidden';

    // Create the stop button element
    const stopMLButton = document.createElement('button');
    stopMLButton.id = 'stopML';
    stopMLButton.className = 'hidden';
    stopMLButton.textContent = 'Stop 007ML';

    // Append the elements to the liveView
    liveView.appendChild(startMLButton);
    liveView.appendChild(videoElement);
    liveView.appendChild(stopMLButton);


    // Add the event listener to the new start/stop button
    startMLButton.addEventListener("click", startMLFunction);
    stopMLButton.addEventListener("click", stopMLFunction);
}


imgInput.addEventListener("change", (e) => {
    // clear recent model prediction
    document.getElementById("input-prediction").innerHTML = "";
    const reader = new FileReader();
    const img = document.getElementById("img");
    
    // Insert the inputed pic inside the image
    reader.onload = function(e) {
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(imgInput.files[0]);
    // Load the model.
    cocoSsd.load().then(model => {
        model.detect(img).then(predictions => {
            const inputPrediction = document.getElementById("input-prediction");
            if (predictions.length > 0) {
                let p = document.createElement("p");
                p.innerHTML = "Found in pic 🔎:";
                inputPrediction.appendChild(p);
                // loop over predictions 
                for (let n = 0; n < predictions.length; n++) {
                    // for each item detected
                    if (predictions[n].score >= 0.80) {
                        const prediction = '✅ ' + predictions[n].class;
                        let li = document.createElement("li");
                        li.innerText = prediction;
                        inputPrediction.appendChild(li);
                    }
                }
            } else {
                let li = document.createElement("li");
                li.innerHTML = "⚠️ Nothing found";
                inputPrediction.appendChild();
            }
        })
    });

    document.getElementById("img").classList.remove("hidden");
});


// StartML function
function startMLFunction(event) {
    const video = document.getElementById("webcam")
    // Only continue if the COCO-SSD has finished loading.
    if (!model) {
        return;
    }
    
    // remove button once clicked
    event.target.classList.add("hidden");
    
    // show videocam & allow to stop videocam
    document.getElementById("stopML").classList.remove("hidden");
    video.classList.remove("hidden");

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            shouldContinuePrediction = true;
            video.srcObject = stream;
            video.addEventListener('loadeddata', predictWebcam);
        });
}


// Image Prediction
function predictImg() {
    // get image uploaded
    const img = document.getElementById('img');

    // Load the model.
    cocoSsd.load().then(model => {
        // detect objects in the image.
        model.detect(img).then(predictions => {
            // console.log('Predictions: ', predictions);
            if (predictions[0].score > 0.80) {
                objectClass = predictions[0].class;
                console.log(
                    predictions[0].class
                    + Math.round(parseFloat(predictions[0].score) * 100)
                    + "% sure"
                );
            }
        });
    });
}


// LiveCam Prediction
function predictWebcam() {
    // Was stopML btn pressed?
    if (!shouldContinuePrediction) {
        return;
    }

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
}

// Pretend model has loaded so we can try out the webcam code.
var model = true;
myApp.classList.remove('invisible');

// StopML function
function stopMLFunction() {
    // Stop prediction 
    shouldContinuePrediction = false;

    const liveView = document.getElementById("liveView");
    // stop video camera
    document.getElementById("webcam").srcObject.getTracks()
        .forEach(track => track.stop());

    // Remove classification elements and event listener
    while (liveView.firstChild) {
        liveView.removeChild(liveView.firstChild);
    }

    // Create new Classification
    newClassification();
}

// call StopML Function
document.getElementById("stopML").addEventListener("click", stopMLFunction);
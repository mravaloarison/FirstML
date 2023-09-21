const myApp = document.getElementById("app");

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




// StartML function
function startMLFunction(event) {
    // Only continue if the COCO-SSD has finished loading.
    if (!model) {
        return;
    }
    
    // remove button once clicked
    event.target.classList.add("hidden");
    
    // show videocam & allow to stop videocam
    document.getElementById("stopML").classList.remove("hidden");
    document.getElementById("webcam").classList.remove("hidden");
}

// Pretend model has loaded so we can try out the webcam code.
var model = true;
myApp.classList.remove('invisible');

// StopML function
function stopMLFunction() {
    const liveView = document.getElementById("liveView");
    // Remove classification elements and event listener
    while (liveView.firstChild) {
        liveView.removeChild(liveView.firstChild);
    }

    // Create new Classification
    newClassification();
}

// call StopML Function
document.getElementById("stopML").addEventListener("click", stopMLFunction);
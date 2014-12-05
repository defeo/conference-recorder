window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    var lock = window.navigator.requestWakeLock("cpu");
    var rec = document.querySelector("body");
    var sd = navigator.getDeviceStorage("music");
    
    navigator.getUserMedia = ( navigator.getUserMedia ||
			       navigator.webkitGetUserMedia ||
			       navigator.mozGetUserMedia ||
			       navigator.msGetUserMedia);
    
    if (navigator.getUserMedia) {
	navigator.getUserMedia ({ audio: true }, function(stream) {
	    var mediaRecorder = new MediaRecorder(stream);
	    
	    rec.onclick = function() {
		console.log("tap");
		if (mediaRecorder.state == "recording") {
		    mediaRecorder.stop();
		    rec.classList.remove('rec');
		} else {
		    mediaRecorder.start();
		    rec.classList.add('rec');
		}
	    }

	    mediaRecorder.ondataavailable = function(e) {
		var request = sd.add(e.data);
		request.onsuccess = function() {
		    console.log(this.result);
		}
		request.onerror = function(e) {
		    console.log('File write error: ' +e);
		    mediaRecorder.stop();
		    rec.classList.remove('rec');
		}
	    };
	}, function(err) {
	    console.log("gUM error: " + err);
	});
    } else {
	console.log("gUM not supported");
    }
});

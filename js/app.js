window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    var rec = document.querySelector("body");
    var sd = navigator.getDeviceStorage("music");
    
    navigator.getUserMedia = ( navigator.getUserMedia ||
			       navigator.webkitGetUserMedia ||
			       navigator.mozGetUserMedia ||
			       navigator.msGetUserMedia);

    if (navigator.getUserMedia) {
	navigator.getUserMedia ({ audio: true }, function(stream) {
	    var lock, base, counter,
		mediaRecorder = new MediaRecorder(stream);
	    
	    mediaRecorder.ondataavailable = function(e) {
		var request = sd.addNamed(e.data, base + '-' + counter + '.oga');
		counter += 1;
		request.onsuccess = function() {
		    console.log(this.result);
		}
		request.onerror = function(e) {
		    console.log(e);
		    mediaRecorder.stop();
		}
	    }
	    mediaRecorder.onstop = function() {
		console.log('stop');
		rec.classList.remove('rec');
		if (lock) lock.unlock();
	    }

	    rec.onclick = function() {
		if (mediaRecorder.state == "inactive") {
		    console.log('recording');
		    rec.classList.add('rec');
		    lock = window.navigator.requestWakeLock("cpu");
		    base = 'recorder/' + (new Date()).getTime();
		    counter = 1;
		    mediaRecorder.start(60*1000);
		} else {
		    mediaRecorder.stop();
		}
	    }
	}, function(err) {
	    console.log("gUM error: " + err);
	});
    } else {
	console.log("gUM not supported");
    }
});

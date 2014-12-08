var tone = new Tone();
var compress = Tone.context.createDynamicsCompressor();
var reverb = new Tone.Freeverb();
var chorus = new Tone.Chorus();
var bpm = 120;
var mSeq, mSeq1, mSeq2;
var mCirc;
var mCirc1;
var mCirc2;
var root0 = 57;
var root1 = 52;
var root2 = 45;


var socket = io.connect();	
var vidPlaying = false;


var beatPerSec = bpm/60;  
var measure = 4/beatPerSec;

var loop0 = new Tone.Clock(measure/16, function(time){
	mSeq.increment(time)
});
var loop1 = new Tone.Clock(measure/6, function(time){
	mSeq1.increment(time)
});
var loop2 = new Tone.Clock(measure/7, function(time){
	mSeq2.increment(time)
});
var button, button1, button2, button3, slider;

var matrix0,matrix1,matrix2;

function setup() {
	
	socket.on('connect', function () {
		console.log("Connected");
	});

	var canvas = createCanvas(1200, 500);
	canvas.position(0,60);
	button = createButton('Save Sequence');
	button1 = createButton('Play Song');
	button2 = createButton('Load Sequence');
	button3 = createButton('Clear Sequence');
	//slider = createSlider(60,300, bpm);
    	 // attach button listener
	loop0.start();
	loop1.start();
	loop2.start();
	reverb.setPreset("glassroom");
	chorus.setPreset("ether");
	var ringNum0 = 6;
	var arcNum0 = 16;
	var synth0 = new Tone.PolySynth(ringNum0,Tone.DuoSynth);
	synth0.setPreset("Steely");
	synth0.setVolume(-20);
	synth0.connect(chorus);

	var ringNum1 = 5;
	var arcNum1 = 6;
	var synth1 = new Tone.PolySynth(ringNum1,Tone.NoiseSynth);
	//synth1.setPreset("ScratchAttack");
	synth1.setVolume(-30);
	//synth1.connect(compress);
	synth1.connect(reverb);


	var ringNum2 = 4;
	var arcNum2 = 7;
	var synth2 = new Tone.PolySynth(ringNum2,Tone.MonoSynth);
	synth2.setPreset("Bassy");
	synth2.setVolume(1);
	synth2.connect(chorus);

	mCirc = new circleInterface(4*width/5, height/2, ringNum0, arcNum0, 30, root0, synth0);
	mCirc1 = new circleInterface(width/2, height/2, ringNum1 , arcNum1, 20, root1, synth1);
	mCirc2 = new circleInterface(width/5, height/2, ringNum2, arcNum2, 40, root2, synth2);

	mSeq = new Sequencer(bpm, mCirc, 1/8, 16 );     
	mSeq1 = new Sequencer(bpm, mCirc1,  1/3, 6);
	mSeq2 = new Sequencer(bpm, mCirc2,  2/7, 7);
	chorus.connect(compress);
	reverb.connect(compress);
	compress.threshold.value = -20;
	compress.ratio.value = 6;
	compress.attack.value = 0.01;
	compress.release.value = 0.01;
	compress.toMaster();

	button.mousePressed(saveMatrix);
	button1.mousePressed(playSong);
	button2.mousePressed(loadMatrix);
	button3.mousePressed(clearMatrix);
	var x = 650; 
	button.position(20+x, 16);
	button1.position(413+x, 16);
	button2.position(150+x, 16);
	button3.position(280+x, 16);
	//slider.position(x-50, 16);
}


function draw() {
	background(0); 
	mCirc1.draw(mSeq1.currentBeat);
	mCirc.draw(mSeq.currentBeat);
	mCirc2.draw(mSeq2.currentBeat);
	// saveMatrix();
	// loadMatrix();
	if (vidPlaying){
		if (mSeq1.currentBeat == 1){
			socket.emit ('switchMatrix', "0");
			socket.on('newMatrix', function(data){
				matrix0 = data[0];
				matrix1 = data[1];
			     matrix2 = data[2];	
			     mCirc.loadMatrix(matrix0);           //this will load Markov Chain Output matrix
		  		mCirc1.loadMatrix(matrix1); 
		  		mCirc2.loadMatrix(matrix2); 
			})
		}
	}

}

function saveMatrix(){              //this will save matrix into markov Chain
	mCirc.saveMatrix();
	matrix0 = mCirc.synthMatrix;
	mCirc1.saveMatrix();
	matrix1 = mCirc1.synthMatrix;
	mCirc2.saveMatrix();
	matrix2 = mCirc2.synthMatrix;
	var tempData = []
	tempData = [matrix0,matrix1,matrix2];
	socket.emit ('saveMatrix', tempData);
	console.log("Sequence saved");
}

function playSong(){     
	if (vidPlaying){
		socket.emit ('switchMatrix', "0"); 
		button1.html('Play Song');
	}else{
		button1.html('Stop Song');
	}
	vidPlaying = !vidPlaying;
}            


function loadMatrix(){
	socket.emit ('loadMatrix', "0"); 
	socket.on('newMatrix', function(data){
		console.log(data);
		matrix0 = data[0];
		matrix1 = data[1];
	     matrix2 = data[2];	
	     mCirc.loadMatrix(matrix0);           //this will load Markov Chain Output matrix
  		mCirc1.loadMatrix(matrix1); 
  		mCirc2.loadMatrix(matrix2); 
	})
  	console.log("Sequence loaded");
}

function clearMatrix(){   
	mCirc.clearMatrix();                  //this will clear the current matrix
 	mCirc1.clearMatrix();
 	mCirc2.clearMatrix();
 	console.log("Sequence cleared");
}


//MOUSE HELPER FUNCTIONS
function mousePressed() {
  if (mousePressed){
    mCirc.arcPressed();
    mCirc1.arcPressed();
    mCirc2.arcPressed();
  }
}

function mouseDragged() {
  if (mousePressed){
    	mCirc.arcPressed();
    	mCirc1.arcPressed();
    	mCirc2.arcPressed();
  }
}

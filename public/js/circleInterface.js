//================================================//                
//====================INTERFACE===================//
//================================================//

var circleInterface = function(x,y,cirNum, beatsPerMeasure, ringWidth, root, synth){
  // midi notes
  this.x = x;
  this.y = y;
  this.ringWidth = ringWidth;
  this.noteArray = [0, 2, 4, 7, 9,12];
  this.root = root;
  this.circles = [];
  this.cirNum = cirNum;
  this.synth = synth;
  this.synthMatrix = [];
  this.synthMatrix.length = cirNum;
  this.beatsPerMeasure  = beatsPerMeasure;
  for (var i = 0; i < this.cirNum; i++){
    this.circles.push(new Circle(x,y,this.cirNum*this.ringWidth-this.ringWidth*i,this.beatsPerMeasure,i, this.cirNum, this.ringWidth, this.synth));
    this.synthMatrix[i] = [];
    for(var j = 0; j < this.beatsPerMeasure; j++){
        this.synthMatrix[i].push(0);
    }
  }
}


circleInterface.prototype.draw = function(currentBeat) {
  push();
    translate(this.x,this.y);
    for (var i = 0; i < this.cirNum; i++){
        this.circles[i].draw(currentBeat);
    }; 
  pop();
}

circleInterface.prototype.play = function(currentBeat){
    for (var i = 0; i < this.cirNum; i++){                        
        this.circles[i].playNote(this.noteArray[5-i] + this.root, currentBeat);         
    }
}

circleInterface.prototype.arcPressed = function(){
    for (var i = 0; i<this.circles.length; i++){
          for (var j =0;  j < this.circles[i].arcs.length; j++){
              this.circles[i].arcs[j].play(mouseX, mouseY);
          }
    }
}

circleInterface.prototype.saveMatrix = function(){
    for (var i = 0; i<this.circles.length; i++){
        for (var j = 0;  j < this.circles[i].arcs.length; j++){
            if (this.circles[i].arcs[j].isOn){
                this.synthMatrix[i][j] = this.noteArray[5-i] + this.root;
            }else{
                this.synthMatrix[i][j] = 0;
            }
        }
    }
}

circleInterface.prototype.loadMatrix = function(newSynthMatrix){
     for (var i = 0; i<this.circles.length; i++){
            for (var j = 0;  j < this.circles[i].arcs.length; j++){
                  if (newSynthMatrix[i][j]> 0){
                      this.circles[i].arcs[j].isOn = true;
                  }else{
                      this.circles[i].arcs[j].isOn = false;
                  }
            }
      }
}

circleInterface.prototype.clearMatrix = function(){
      for (var i = 0; i<this.circles.length; i++){
            for (var j =0;  j < this.circles[i].arcs.length; j++){
                  this.circles[i].arcs[j].isOn = false;
                  
            }
      }
}

//================================================//                
//============CIRCLE THAT HOLDS ARCS==============//
//================================================//

var Circle = function(x, y, seqRadius, beatsPerMeasure, cirNum, cirAmt, ringWidth, synth) {
  this.x = x;
  this.y = y;
  this.cirNum = cirNum;
  this.cirAmt = cirAmt;
  this.ringWidth = ringWidth;
  this.beatsPerMeasure = beatsPerMeasure;
  this.rad = seqRadius;
  this.c = color(random(127,255), random(127,255), random(127,255));
  this.arcs = [];
  this.noteMatrix = [];
  this.noteMatrix.length = beatsPerMeasure;
  this.synth = synth;                                  //cur Oscillator Index
  for (var i = 0; i < this.beatsPerMeasure; i++) {
      this.arcs.push( new Arc(i,this.rad*2, TWO_PI/this.beatsPerMeasure,this.c, this.x, this.y, this.cirNum, this.cirAmt, this.ringWidth) );
  }

}

Circle.prototype.draw = function(currentBeat) {
    stroke(100);
    fill(this.c );
    ellipse(0,0,this.rad*2, this.rad*2);
    var beatAngle = TWO_PI/this.beatsPerMeasure;
    //draw grid lines
    for(var i = 0; i < this.beatsPerMeasure; i++){
        stroke(0);  
        strokeWeight(3);
        var curBeatAngle = beatAngle * i;
        var beat_x = cos(curBeatAngle) * this.rad;
        var beat_y = sin(curBeatAngle) * this.rad;
        line(0, 0, beat_x, beat_y);
        this.arcs[i].draw();
        if(i == currentBeat ){ 
            noFill();
            strokeWeight(3);
            stroke(255);
            arc(0, 0, this.rad*2, this.rad*2, curBeatAngle, curBeatAngle + beatAngle);
        }
    }  
}

Circle.prototype.playNote = function(n, currentBeat) {
    if(this.arcs[currentBeat].isOn){
        this.synth.triggerAttackRelease(tone.midiToNote(n),"16n");
        this.noteMatrix[currentBeat] = 0;
    }else{
        this.noteMatrix[currentBeat] = 0;
    }
}


//================================================//                
//==========ARC THAT Contain Step State===========//
//================================================//

var Arc = function(place, diam, angle, color, offsetX, offsetY, cirNum, cirAmt, ringWidth) {
  this.x = offsetX;
  this.y = offsetY;
  this.place = place;
  this.cirNum = cirNum;
  this.cirAmt  = cirAmt;
  this.diam = diam;
  this.ringWidth = ringWidth;
  //console.log(cirNum)
  this.angle = angle;
  this.c = color;
  this.isOn = false;
}

Arc.prototype.draw = function() {
  if (this.isOn == true) fill(this.c);
  else fill(0,0,0);
  strokeWeight(3);
  stroke(0,0,0,.2);
  arc(0, 0, this.diam, this.diam, this.place*this.angle, (this.place*this.angle) + this.angle);
}

Arc.prototype.play = function(mouseX, mouseY, ringWidth) {
  if ( IsPointInsideArc(this.cirNum, mouseX-this.x, mouseY-this.y, 0, 0, this.diam, this.place*this.angle, (this.place*this.angle + this.angle), this.cirAmt, this.ringWidth) ) {
    this.isOn =!this.isOn;
  }
}

//helper functions

function normalizeAngle(angle)
{
  var nA = angle % (2 * PI);
  if (nA < 0) nA = 2*PI + nA;
  return nA;
}

function IsPointInsideArc(place, pointX, pointY, centerX, centerY, diam, angle1, angle2, cirNum, ringWidth)
{
  var dist = sqrt(sq(pointX - centerX) + sq(pointY - centerY));
  dist = dist +ringWidth;  
  if (dist < (diam/2)+ringWidth &&  dist> (cirNum-place)*ringWidth){
     var nA1 = normalizeAngle(angle1);
     var nA2 = normalizeAngle(angle2);
      // Find the angle between the point and the x axis from the center of the circle
     var a = normalizeAngle(atan2(pointY - centerY, pointX - centerX));
     var between;
     if (nA1 < nA2){
        between = nA1 <= a && a <= nA2;
      } else {
        between = !(nA2 <= a && a <= nA1);
      }
      return between;
  }else{
      return false;
  }
}
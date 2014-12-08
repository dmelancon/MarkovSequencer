//================================================//                
//================SEQUENCER//CLOCK================//
//================================================//
var Sequencer = function(bpm, interFace,  beatLength, beatsPerMeasure) {
  this.step = 0;
  this.beatLength = beatLength;
  this.bpm = bpm;
  this.beatsPerMeasure = beatsPerMeasure;
  this.currentMeasure;
  this.currentBeat; 
  this.howFarInMeasure;
  this.interFace = interFace;
}
 
Sequencer.prototype.increment = function() {                   
  this.step++;
  this.currentBeat = this.step % this.beatsPerMeasure;
  this.currentMeasure = this.step / this.beatsPerMeasure;

   this.interFace.play(this.currentBeat);

}



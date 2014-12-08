var Markov = function(ringNum, arcNum){
    // this.currentIndex = 0;
    // this.idx = [];
    // this.idx.length = 128;
    // this.indexed_sequence = [];
    // this.newMatrix = [];
    // this.indexed_sequence.length = this.tempArray.length;

    this.markov = [];
    this.markov.length = ringNum;
    this.ringNum = ringNum;
    this.arcNum = arcNum;
    for (var i = 0; i<ringNum; i++){
        for(var j = 0; j<arcNum; j++){
            this.markov[i] = [];
        }
    }
}



Markov.prototype.save = function(synthMatrix){
    for (var i = 0; i<this.ringNum; i++){
        for(var j = 0; j<this.arcNum; j++){
            this.markov[i].push(synthMatrix[i][j]);
        }
    }
}

Markov.prototype.getMatrix = function(){

}


Markov.prototype.generate = function(){
 
}
  
// var getNext = function(){
//     var transitionPos = getRandomInt(0, this.markov[this.currentIndex].length);
//     var nextIndex = this.markov[this.currentIndex][transitionPos];
//     this.currentIndex = nextIndex;   
//     return this.idx[this.currentIndex];
//   }
  
// }

// var getRandomInt = function(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }







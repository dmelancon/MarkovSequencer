var express   = require('express');
var app       = express();
var socketio  = require('socket.io');
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'));
var io     = require('socket.io').listen(server);


app.use('/', express.static(__dirname + '/public'));
app.use('/js',  express.static(__dirname + '/js'));



var newMatrix = [];
newMatrix.length = 3;
var currentMatrix;
var ngrams = {};          //all in grams

io.sockets.on('connection', function (socket) {
    console.log("We have a new client: " + socket.id);
    
    socket.on('saveMatrix', function(data) {
      console.log(ngrams);
          currentMatrix = data;
          var temp = [];
          for (var i = 0; i<currentMatrix.length; i++){
            temp.push(deconstruct(currentMatrix[i]));
          }
          for (var i = 0; i<temp.length; i++){
            var tempArcNum = temp[i].length;
            newMatrix[i] = reconstruct(nGrams(temp[i],1),tempArcNum);
          }
    });
    socket.on('loadMatrix', function(data) {
        

          socket.emit('newMatrix', newMatrix);
    });
    socket.on('switchMatrix', function(data) {
          var temp = [];
          for (var i = 0; i<newMatrix.length; i++){
            temp.push(deconstruct(newMatrix[i]));
          }
          for (var i = 0; i<temp.length; i++){
            var tempArcNum = temp[i].length;
            newMatrix[i] = reconstruct(nGrams(temp[i],1),tempArcNum);
          }

          socket.emit('newMatrix', newMatrix);
    });


    socket.on('disconnect', function() {
      console.log("Client has disconnected " + socket.id);
    });
  }
);




function deconstruct(currentArray){
    var newArray = [];
    var fullArray = [];
     for (var i = 0; i<currentArray[0].length; i++){
          for (var j = 0; j<currentArray.length; j++){
           newArray.push(currentArray[j][i]);
          }  
          fullArray.push(newArray);
          newArray = [];
      }   
  return fullArray;
}



function reconstruct(currentArray, arcNum){
  newArray = [];
  var len = currentArray.length;
  for (var j = 0; j < currentArray[0].length; j++){
    newArray.push([]);
    for( var i = 0; i<len; i++){
        newArray[j][i] = currentArray[i][j];
    }
    for ( var i = len; i< arcNum; i++){
        newArray[j][i] = 0;
    }
  }
  return newArray;
}

function nGrams(currentArray, n) {
  
  for (var i = 0; i < currentArray.length - n; i++) {
    var gram = currentArray.slice(i, i + n);
    var next = currentArray[i + n];
    if (!ngrams.hasOwnProperty(gram)) {
      ngrams[gram] = [];
    }
    ngrams[gram].push(next);
  }
  var current = choice(currentArray); 
  var output = [];
  output.push(current);
      
  for (var i = 0; i < currentArray.length-1; i++) {
    if (ngrams.hasOwnProperty(current)) {
 
      var possible = ngrams[current];

      var next = choice(possible);

      output.push(next);
 
      current = output.slice(output.length-n, output.length);
    } else {
      break;
    }
  }
  return output;
}

function randomNGram(currentArray,n) {
      var current = choice(currentArray); 
      var output = [];
      var possible = ngrams[current];
      var next = choice(possible);
       output.push(current);  
  for (var i = 0; i < currentArray.length-1; i++) {
    if (ngrams.hasOwnProperty(current)) {
      var possible = ngrams[current];
      var next = choice(possible);
      output.push(next);
      current = output.slice(output.length-n, output.length);
    } else {
      break;
    }
  }
  return output;
}

function choice(somelist) {
  var i = Math.floor(Math.random() * (somelist.length));
    return somelist[i];
}



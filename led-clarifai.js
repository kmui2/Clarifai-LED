var five = require("johnny-five");
var board = new five.Board();

const express = require('express')
const axios = require('axios');
const path = require("path");
const bodyParser = require('body-parser');

let app = express();
let rainbow = ["FF0000", "FF7F00", "FFFF00", "00FF00", "0000FF", "4B0082", "8F00FF"];


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('port', (process.env.PORT || 8001));
app.use(express.static(__dirname + '/public'));


app.listen(app.get('port'), function () {
  console.log("Node app is running at http://localhost:" + app.get('port'));
})

axios.get('http://104.131.24.33:8003/leds')
.then(function (response) {
  console.log(response);
  rainbow = response.data.rainbow;
  board.on("ready", function() {

    
    lcd = new five.LCD({
      // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
      // Arduino pin # 7    8   9   10  11  12
      pins: [7, 8, 9, 10, 11, 12],
      backlight: 6,
      rows: 2,
      cols: 20


      // Options:
      // bitMode: 4 or 8, defaults to 4
      // lines: number of lines, defaults to 2
      // dots: matrix dimensions, defaults to "5x8"
    });

    this.repl.inject({
      lcd: lcd
    });


    var rgb = new five.Led.RGB([6, 5, 3]);
    var index = 0;
    this.loop(3000, function() {
      lcd.clear().cursor(0, 0).print('#'+rainbow[index]);
      rgb.color(rainbow[index++]);
      if (index === rainbow.length) {
        index = 0;
      }
    });
  });
})
.catch(function (error) {
  console.log(error);
});


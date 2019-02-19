let slice = 0;
let wealthCount =0;
let period = 100;
let angle;

let lastWealth = 0;
let thisWealth =0;
let wealthRate = 0;

let demand = 0;
let lightLevel = 0;
let rotVal = 0;
let accLight = 0;
let  artLight = 0;
let detLight = 0;
let correctDirect = 0;
let shadeAmount =0;
let prodDiff = 0;
let back = 0;
let opp = 255;



let lastPV;
let indexTable;

function preload() {
  indexTable = loadTable("https://raw.githubusercontent.com/graysonBailey/cyberFactory/master/cyberfactory2.csv", "csv");
}


function setup() {
  createCanvas(1000, 1000);
  colorMode(RGB, 255);
  frameRate(10);

  background(back);
  noStroke();
}

function draw() {
  fill(back, 2);
  rectMode(CORNER);
  rect(0, 0, width, height);

  determineValues();
  checkCalc();

  circling();

  slicing();
}

function slicing() {
  if (slice < indexTable.getRowCount()-1) {
    slice++;
  } else {

    slice = 0;
    wealthCount = 0;
  }
  if (slice  == indexTable.getRowCount()-1 || slice %200 == 0) {
    saveFrame("finalBuild_#####.png");
  }
}




function checkCalc() {

  if (frameCount % period == 0) {

    noStroke();
    fill(back, 80);
    rect(0, 0, width, height);


    fill(back, 120);
    stroke(opp);
    strokeWeight(1);
    line(width/2, (height/2)-4, width, (height/2)-4);

    wealthRateVis();
    prodDiffVis();
    demandVis();
  }
}

function determineValues() {

  angle = (slice/100.0)*TWO_PI;




  shadeAmount = map(indexTable.get(slice, 1), 0, 180, 250, 360);
  artLight = indexTable.get(slice, 1);
  lightLevel = indexTable.get(slice, 2);
  accLight = indexTable.get(slice, 3);
  rotVal = indexTable.get(slice, 4);

  demand = indexTable.get(slice, 6);
  wealthRate = indexTable.get(slice, 7);
  prodDiff = wealthRate-demand;
  wealthCount = indexTable.get(slice, 9);
  correctDirect = indexTable.get(slice, 10);
}

function circling() {



  var tempPV = createVector(cos(angle)*(accLight/5), sin(angle)*(accLight/5));
  push();
  translate(width/2, height/2);

  var size = map(dist(tempPV.x, tempPV.y, 0, 0), 0, 210, 1, 3);

  //wealthVis
  drawWealth();


  if (slice > 0 && indexTable.get(slice, 9) > indexTable.get(slice-1, 9)) {
    stroke(128, 0, 32);
    line(tempPV.x, tempPV.y, tempPV.x*1.1, tempPV.y*1.1);

    stroke(157, 255, 212);
    line(tempPV.x, tempPV.y, tempPV.x*.9, tempPV.y*.9);



    stroke(opp);
    strokeWeight(1);
    fill(back);
    ellipse(tempPV.x, tempPV.y, 4, 4);
    strokeWeight(1);
  } else {



    fill(opp);
    ellipse(tempPV.x, tempPV.y, size, size);
  }
  artLightDraw();
  lightLevelDraw();
  artShadeDraw();


  pop();
}

function lightLevelDraw() {
  var mult = 10;
  var inLPV = createVector(cos(angle)*(lightLevel*mult), sin(angle)*(lightLevel*mult)); 
  noStroke();
  fill(240, 230, 140);
  ellipse(inLPV.x, inLPV.y, 3, 3);
}

function artLightDraw() {

  if (artLight >=1) {
    var mult = 10;
    var inLPV = createVector(cos(angle)*(lightLevel*mult), sin(angle)*(lightLevel*mult));
    mult = mult + map(artLight, 0, 35, 0, 1.5);

    var artLPV = createVector(cos(angle)*(lightLevel*mult), sin(angle)*(lightLevel*mult));


    stroke(opp);
    strokeWeight(.5);
    line(artLPV.x, artLPV.y, inLPV.x, inLPV.y);

    noStroke();
    fill(0, 240, 240);
    ellipse(artLPV.x, artLPV.y, 3, 3);
  }
}

function artShadeDraw() {

  if (shadeAmount > 260) {

    var shadePV = createVector(cos(angle)*(shadeAmount), sin(angle)*(shadeAmount));
    push();
    translate(shadePV.x, shadePV.y);
    rotate(angle);




    stroke(255, 173, 173);
    strokeWeight(.5);
    //line(shadePV.x*1.01, shadePV.y*1.01, shadePV.x*.99, shadePV.y*.99);
    line(0, -2, 0, 2);


    pop();
  }
}



function wealthRateVis() {

  for (var i = 0; i < wealthRate+1; i++) {
    noStroke();
    fill(opp);
    rect(width - (10*i), (height/2)-10, 6, 6);
  }
}

function prodDiffVis() {
  noStroke();

  if (prodDiff >0) {
    fill(0, 0, 255);
  } else if (prodDiff < 0) {
    fill(255, 0, 0);
  } else if (prodDiff == 0) {
    stroke(opp);
    strokeWeight(2);
    strokeCap(SQUARE);
    line(width-4, (height/2), width-20, height/2);
    strokeWeight(1);
  }

  for (var i = 0; i < abs(prodDiff); i++) {
    rect(width - 10, (height/2)+(i*10), 6, 6);
  }
  noStroke();
}

function drawWealth() {
  var wealthPV = createVector(cos(angle)*(wealthCount), sin(angle)*(wealthCount));
  stroke(255, 215, 0, 120);
  strokeWeight(1);
  noFill();
  if (slice == 0) {
    line(0, 0, wealthPV.x, wealthPV.y);
  } else {

    //(242, 196, 7
    strokeWeight(1);
    line(lastPV.x, lastPV.y, wealthPV.x, wealthPV.y);
    noStroke();
  }

  lastPV = wealthPV;
}

function demandVis() {
  for (var i = 0; i < demand; i++) {
    noStroke();
    fill(130);
    rect((width-100) - (10*i), (height/2)-10, 6, 6);
  }
}

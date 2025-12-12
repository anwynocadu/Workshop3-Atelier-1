//Atelier 1 Workshop 3 - Building Characters, 2025
//Anwyn Westgarth DJ BOY

//GAME START!! 
let gameStarted = false; 
let wakeTapTime = 0; 
let wakeDisplayDuration = 1000; 
let djHiDisplayed = false; 

//ui elements
let bg, record, airhornImg, blueImg, pinkImg, burgerImg, confettiImg;

//character 
let djsleepImg, djwaveImg, djscratchImg, zzzGif, djidleImg, djchezburgerImg, djairhornImg, djthumbsupImg;
let djDanceImgs = [];
let currentDanceFrame = 0; let lastDanceSwitch = 0;
let bounceTimer = 0; let lastSprite = null;
let djposesImgs = [];
let currentPoseIndex = 0;
let chezburgerActive = false;
let djState = "sleep"

//sound variables
let cheezSound, airhornSound, scratchSound, poseSound, yaySound;

//bgm 
let bgmTracks = [];
let currentTrackIndex = 0;

//record spin
let energy = 0, velocity = 30, rotationspeed = 0.0, recordangle = 0;

// button states
let recordPressed = false, bluePressed = false, pinkPressed = false, burgerPressed = false, airhornPressed = false;

//celebration 
let energyFull = false;
let celebrationStartTime = 0;
let celebrationDuration = 3000;
let confettiActive = false;
let yayPlayed = false; 

//POSITIONS

//record
const RECORD_CX = 252;    
const RECORD_CY = 1598;    
const RECORD_SIZE = 440;   

//blue pill button
const BLUE_CX = 602;
const BLUE_CY = 1420;
const BLUE_W = 214;
const BLUE_H = 79;

//pink pill button
const PINK_CX = 602;
const PINK_CY = 1524;
const PINK_W = 213;
const PINK_H = 75;

//burger button
const BURGER_CX = 611;
const BURGER_CY = 1716;
const BURGER_W = 241;
const BURGER_H = 188;

//airhorn button
const AIRHORN_CX = 860;
const AIRHORN_CY = 1599;
const AIRHORN_W = 264;
const AIRHORN_H = 460;

function preload() {
  bg = loadImage('digitizerbg.png');
  record = loadImage('recordbutton_.png');

  djidleImg = loadImage('DJAwakeIdle.png');
  djsleepImg = loadImage('DJSleep.png');    
  djwaveImg = loadImage('DjHi.png');    
  zzzGif = loadImage('zzz.gif');
  djthumbsupImg = loadImage('DJThumbsUp.png');

  airhornImg = loadImage('airhornbutton.png'); 
  blueImg    = loadImage('bluebutton.png');
  pinkImg    = loadImage('pinkbutton_.png');
  burgerImg  = loadImage('chezburgerbutton_.png');
  confettiImg = loadImage('Confetti.gif');

  djDanceImgs[0] = loadImage('DJDance1.png');
  djDanceImgs[1] = loadImage('DJDance2.png');
  djDanceImgs[2] = loadImage('DJDance3.png');

  djposesImgs[0] = loadImage('DJJojoPose1.png');
  djposesImgs[1] = loadImage('DJJojoPose2.png');
  djposesImgs[2] = loadImage('DJJojoPose3.png');
 
  djscratchImg = loadImage('DJRecordScratch.png');
  djchezburgerImg = loadImage('DJChezburger.png');
  djairhornImg = loadImage('DJAirhorn.png');

  cheezSound   = loadSound('mmm-cheezburger.mp3');
  airhornSound = loadSound('airhorn_1.mp3');
  scratchSound = loadSound('RecordScratch.mp3');
  poseSound    = loadSound('Pose.mp3');
  yaySound     = loadSound('Yay.mp3');

  bgmTracks[0] = loadSound('CandyCandy.mp3');
  bgmTracks[1] = loadSound('Luvoratory.mp3');
  bgmTracks[2] = loadSound('UltraC.mp3');

}

function setup() {
  createCanvas(1020, 1855);
  pixelDensity(1);
  
  //force initial sleep state
  djState = "sleep";
  gameStarted = false;
  energy = 0;
}

function draw() {
  imageMode(CORNER);
  background(bg);
  imageMode(CENTER);
  
  //handle wake transition if showing hiiiii sprite 
  if (djHiDisplayed) {
    let timeSinceWake = millis() - wakeTapTime;
    if (timeSinceWake >= wakeDisplayDuration) {
      djHiDisplayed = false;
      djState = "idle";
      gameStarted = true;
      //start BGM when fully awake
      if (!bgmTracks[currentTrackIndex].isPlaying()) {
        bgmTracks[currentTrackIndex].loop();
      }
    }
  }
  
  //if DJ is still asleep draw frozen scene
  if (!gameStarted && !djHiDisplayed) {
    drawSleepingScene();
    return; //exit early - don't run any game logic
  }
  
//GAME LOGIC STARTS HERE
  rotationspeed = map(velocity, 0, 100, 0, 100) / 1000;

//CELEBRATION CHECK
  if (energy >= 100 && !energyFull) {
    energyFull = true;
    confettiActive = true;
    celebrationStartTime = millis();
    energy = 100; 
    yayPlayed = false; 
  }
  
  //play yay sound once at start of celebration
  if (energyFull && confettiActive && !yayPlayed) {
    if (yaySound) {
      yaySound.play();
      yayPlayed = true;
    }
  }
  
  //check if celebration time is up
  if (energyFull && confettiActive) {
    let elapsed = millis() - celebrationStartTime;
    if (elapsed >= celebrationDuration) {
      //reset everything
      energy = 0;
      energyFull = false;
      confettiActive = false;
      celebrationStartTime = 0;
      yayPlayed = false;
    }
  }

//RECORD SPINNING
  push();
  translate(RECORD_CX, RECORD_CY);
  if (recordPressed) {
    translate(0, 5);   
    scale(0.95);       
  }
  rotate(recordangle);
  image(record, 0, 0, RECORD_SIZE, RECORD_SIZE);
  pop();

  //blue pill button
  push();
  translate(BLUE_CX, BLUE_CY);
  if (bluePressed) {
    translate(0, 5);
    scale(0.95);
  }
  image(blueImg, 0, 0, BLUE_W, BLUE_H);
  pop();

  //pink pill button
  push();
  translate(PINK_CX, PINK_CY);
  if (pinkPressed) {
    translate(0, 5);
    scale(0.95);
  }
  image(pinkImg, 0, 0, PINK_W, PINK_H);
  pop();

  //burger button
  push();
  translate(BURGER_CX, BURGER_CY);
  if (burgerPressed) {
    translate(0, 5);
    scale(0.95);
  }
  image(burgerImg, 0, 0, BURGER_W, BURGER_H);
  pop();

  //airhorn button
  push();
  translate(AIRHORN_CX, AIRHORN_CY);
  if (airhornPressed) {
    translate(0, 5);
    scale(0.95);
  }
  image(airhornImg, 0, 0, AIRHORN_W, AIRHORN_H);
  pop();

  //update record spin 
  if (!energyFull && gameStarted) {
    recordangle += rotationspeed;
  }

  //fade energy (only when awake and not in celebration)
  if (gameStarted && !energyFull && djState !== "sleep") {
    energy -= 0.05;
    energy = constrain(energy, 0, 100);
  }

  //energy bar
  drawEnergyBar(570, 90, 300, 40);

  //character
  if (gameStarted || djHiDisplayed) {
    drawDJ(); 
  }
  
  //draw confetti
  if (confettiActive && confettiImg) {
    image(confettiImg, width/2, height/2, width * 1.2, height * 1.2);
  }
  
//TEXT PROMPT
  drawTextStickers();
}

function drawSleepingScene() {
  //draw static record (not spinning)
  push();
  translate(RECORD_CX, RECORD_CY);
  rotate(0); //no rotation when sleeping
  image(record, 0, 0, RECORD_SIZE, RECORD_SIZE);
  pop();

  //draw buttons (no pressed states)
  push(); translate(BLUE_CX, BLUE_CY); image(blueImg, 0, 0, BLUE_W, BLUE_H); pop();
  push(); translate(PINK_CX, PINK_CY); image(pinkImg, 0, 0, PINK_W, PINK_H); pop();
  push(); translate(BURGER_CX, BURGER_CY); image(burgerImg, 0, 0, BURGER_W, BURGER_H); pop();
  push(); translate(AIRHORN_CX, AIRHORN_CY); image(airhornImg, 0, 0, AIRHORN_W, AIRHORN_H); pop();
  
  //draw energy bar at 0
  drawEnergyBar(570, 90, 300, 40);
  
  //draw sleeping DJ with ZZZ
  imageMode(CENTER);
  if (djsleepImg) {
    image(djsleepImg, 500, 950, djsleepImg.width, djsleepImg.height);
  }
  if (zzzGif) {
    image(zzzGif, 340, 750, zzzGif.width, zzzGif.height);
  }
  
  //draw wake prompt
  drawWakePrompt();
}

function drawWakePrompt() {
  push();
  textAlign(CENTER, CENTER);
  textSize(40);
  textFont('Helvetica');
  
  fill(0);
  stroke(255);
  strokeWeight(4);
  text("Tap DJ to wake up!", width/2, 350);
  
  pop();
}

function drawTextStickers() {
  textAlign(CENTER, CENTER);
  textSize(30);
  textFont('Helvetica'); 
  
  if (djHiDisplayed || (!gameStarted && !djHiDisplayed)) return;
  
  if (djState === "sleep" && energy <= 0) {
    drawStickerText("Tap to wake DJ up !", 540, 350);
  } else if (energy > 0 && !energyFull) {
    drawStickerText("Keep the energy up!", 540, 350);
  }
}

function drawStickerText(message, x, y) {
  push();
  textFont('Helvetica');
  fill(0); // black fill
  stroke(255); // white stroke
  strokeWeight(3);
  text(message, x, y);
  pop();
  
}

function drawDJ() {
  imageMode(CENTER);

  let sprite;
  let djX, djY;

  //if showing Hi sprite, show it and skip other logic
  if (djHiDisplayed) {
    sprite = djwaveImg;
    djX = 550;
    djY = 835;
    
    //draw sprite
    if (sprite) {
      push();
      translate(djX, djY);
      scale(1.0);
      image(sprite, 0, 0, sprite.width, sprite.height);
      pop();
    }
    return; //skip the rest of the function
  }

  //normal DJ state logic
  if (energyFull) {
    djState = "thumbsup";
  } else if (recordPressed) {
    djState = "scratch";
  } else if (bluePressed) {
    djState = "dance";
  } else if (pinkPressed) {
    djState = "pose";
  } else if (burgerPressed) {
    djState = "chezburger";
  } else if (airhornPressed) {
    djState = "airhorn";
  } else if (energy <= 0) {
    djState = "sleep";
  } else {
    djState = "idle";
  }

  if (djState === "idle") {
    sprite = djidleImg;
    djX = 550;
    djY = 835;
  } else if (djState === "sleep") {
    sprite = djsleepImg;
    djX = 500;
    djY = 950;
    if (zzzGif) {
      image(zzzGif, 340, 750, zzzGif.width, zzzGif.height);
    }
  } else if (djState === "dance") {
    if (frameCount - lastDanceSwitch > 30) {
      currentDanceFrame = (currentDanceFrame + 1) % djDanceImgs.length;
      lastDanceSwitch = frameCount;
    }
    sprite = djDanceImgs[currentDanceFrame];
    djX = 500;
    djY = 900;
  } else if (djState === "scratch") {
    sprite = djscratchImg;
    djX = 540;
    djY = 920;
  } else if (djState === "pose") {
    sprite = djposesImgs[currentPoseIndex];
    djX = 500;
    djY = 900;
  } else if (djState === "chezburger") {
    sprite = djchezburgerImg;
    djX = 550;
    djY = 835;
  } else if (djState === "airhorn") {
    sprite = djairhornImg;
    djX = 550;
    djY = 770;
  } else if (djState === "thumbsup") {
    sprite = djthumbsupImg;
    djX = 550;
    djY = 835;
  }

  //bounce trigger
  if (sprite !== lastSprite) {
    bounceTimer = 0;
    lastSprite = sprite;
  }

  //bounce effect 
  let scaleFactor = 1.0;
  if (bounceTimer < 15) { 
    scaleFactor = 1.05 - (bounceTimer * 0.05 / 15);
    bounceTimer++;
  }

  //draw sprite with bounce
  if (sprite) {
    push();
    translate(djX, djY);
    scale(scaleFactor);
    image(sprite, 0, 0, sprite.width, sprite.height);
    pop();
  }

  //party light effect
  if (bluePressed && !energyFull) {
    noStroke();
    
    //change color 5 times per second 
    let cycleFrame = frameCount % 60;
    let colorIndex = floor(cycleFrame / 12); 
    
    //colour cycle
    let colors = [
      [255, 100, 100, 100], // red
      [100, 255, 100, 100], // green
      [100, 100, 255, 100], // blue
      [255, 255, 100, 100], // yellow
      [255, 100, 255, 100]  // pink
    ];
    
    //use the selected color
    let selectedColor = colors[colorIndex];
    fill(selectedColor[0], selectedColor[1], selectedColor[2], selectedColor[3]);
    rect(0, 0, width, height);
  }
}

//energy bar
function drawEnergyBar(x, y, w, h) {
  let barColor;
  if (energy < 33) {
    barColor = color(255, 0, 0); //red
  } else if (energy < 66) {
    barColor = color(255, 255, 0); //yellow
  } else {
    barColor = color(0, 200, 0); //green
  }

  stroke(255);
  strokeWeight(7);
  noFill();
  rect(x, y, w, h);

  noStroke();
  fill(barColor);
  let filledWidth = map(energy, 0, 100, 0, w);
  rect(x, y, filledWidth, h);
}

//input handling
function handlePress(px, py) {
  // If DJ is sleeping either at start or after falling asleep and not showing Hi
  if (djState === "sleep" && !djHiDisplayed) {
    const DJ_SLEEP_X = 500;
    const DJ_SLEEP_Y = 950;
    const DJ_SLEEP_W = 400;
    const DJ_SLEEP_H = 600;
    
    if (pointInRect(px, py, DJ_SLEEP_X, DJ_SLEEP_Y, DJ_SLEEP_W, DJ_SLEEP_H)) {
      djHiDisplayed = true;
      wakeTapTime = millis();
      energy += 15;
      energy = constrain(energy, 0, 100);
      return true;
    }
    //if DJ is sleeping and tap is NOT on DJ, ignore ALL input
    return false;
  }
  
  //if showing Hi sprite, ignore all inputs
  if (djHiDisplayed) {
    return false;
  }
  
  //if in celebration mode, ignore all button presses
  if (energyFull) {
    return false;
  }
  
  //NORMAL BUTTON HANDLING (when DJ is awake)
  let pressedSomething = false;

  //record
  if (pointInRect(px, py, RECORD_CX, RECORD_CY, RECORD_SIZE, RECORD_SIZE)) {
    recordPressed = true;
    onRecordPress();
    pressedSomething = true;
  }

  //blue pill
  if (pointInRect(px, py, BLUE_CX, BLUE_CY, BLUE_W, BLUE_H)) {
    bluePressed = true;
    onBluePress();
    pressedSomething = true;
  }

  //pink pill
  if (pointInRect(px, py, PINK_CX, PINK_CY, PINK_W, PINK_H)) {
    pinkPressed = true;
    onPinkPress();
    pressedSomething = true;
  }

  //burger
  if (pointInRect(px, py, BURGER_CX, BURGER_CY, BURGER_W, BURGER_H)) {
    burgerPressed = true;
    onBurgerPress();
    pressedSomething = true;
  }

  //airhorn
  if (pointInRect(px, py, AIRHORN_CX, AIRHORN_CY, AIRHORN_W, AIRHORN_H)) {
    airhornPressed = true;
    onAirhornPress();
    pressedSomething = true;
  }

  if (pressedSomething && !energyFull) {
    energy += 15;
    energy = constrain(energy, 0, 100);
  }
  
  return pressedSomething;
}

function handleRelease() {
  recordPressed = false;
  bluePressed = false;
  pinkPressed = false;
  burgerPressed = false;
  airhornPressed = false;
}

//center-based rect hit test
function pointInRect(px, py, cx, cy, w, h) {
  return (
    px > cx - w / 2 &&
    px < cx + w / 2 &&
    py > cy - h / 2 &&
    py < cy + h / 2
  );
}

//mouse (desktop)
function mousePressed() {
  userStartAudio(); 
  handlePress(mouseX, mouseY);
}
function mouseReleased() {
  handleRelease();
}

//touch (phone)
function touchStarted() {
  userStartAudio(); 
  if (touches.length > 0) {
    handlePress(touches[0].x, touches[0].y);
  }
  return false; //prevent page scroll
}
function touchEnded() {
  handleRelease();
  return false;
}

//BUTTON FUNCTIONS
function onRecordPress() {
  console.log('record pressed');

  //stop current track if playing
  if (bgmTracks[currentTrackIndex].isPlaying()) {
    bgmTracks[currentTrackIndex].stop();
  }

  //play scratch sound first
  scratchSound.play();

  //when scratch finishes play next track
  scratchSound.onended(() => {
    currentTrackIndex = (currentTrackIndex + 1) % bgmTracks.length;
    bgmTracks[currentTrackIndex].loop();
  });
}

function onBluePress() {
  console.log('blue button pressed');
}

function onPinkPress() {
  console.log('pink button pressed');
  currentPoseIndex = (currentPoseIndex + 1) % djposesImgs.length;
  djState = "pose";
  if (poseSound) poseSound.play();
}

function onBurgerPress() {
  console.log('burger pressed');
  djState = "chezburger";
  chezburgerActive = true;
  setTimeout(() => {
    djState = "idle";
    chezburgerActive = false;
  }, 1000);

  if (cheezSound) cheezSound.play();
}

function onAirhornPress() {
  console.log('airhorn pressed');
  if (airhornSound) airhornSound.play();
}
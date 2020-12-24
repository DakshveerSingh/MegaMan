var PLAY = 1;
var END = 0;
var gameState = PLAY;

var main, main_running, main_collided,main_dead;
var invisibleGround;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;

var gameOver, restart,bgImg;

localStorage["HighestScore"] = 0;

function preload(){
  main_running =   loadAnimation("images/MCrun1.png","images/MCrun2.png","images/MCrun3.png","images/MCrun4.png","images/MCrun5.png");
  main_collided = loadAnimation("images/MCdie1.png","images/MCdie2.png","images/MCdie3.png");
  main_dead = loadImage("images/MCdie3.png")
  obstacle1 = loadImage("images/obs2.png");
  obstacle2 = loadImage("images/obs3.png");
  obstacle3 = loadImage("images/obs4.png");

  bgImg = loadImage("images/bgmain.png")
  gameOverImg = loadImage("images/gameover.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(displayWidth,300);
  
  main = createSprite(50,280,20,50);
  
  main.addAnimation("running", main_running);
  main.addAnimation("collided", main_collided);
  main.addAnimation("dead", main_dead);
  main.scale = 0.5;
//main.debug =true;
  main.setCollider("rectangle",0,0,60,100);
  
  gameOver = createSprite(width/16,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/16,200);
  restart.addImage(restartImg);
  
  gameOver.scale = 1.0;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,290,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //main.debug = true;
  background(bgImg);
  textAlign(CENTER);
  textSize(15);
  text("Score: "+ score, width/15,50);
  camera.position.x = main.x;
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && main.y >= 230) {
      main.velocityY = -12;
    }
  
    //gravity
    main.velocityY = main.velocityY + 0.8
  
    /*if (ground.x < 0){
      ground.x = ground.width/2;
    }*/
  
    main.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(main)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    
    //set velcity of each game object to 0
    //ground.velocityX = 0;
    main.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    //change the main animation
    main.changeAnimation("collided",main_collided);
    main.changeAnimation("dead");
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  drawSprites();
}

/*function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = main.depth;
    main.depth = main.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}*/

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,265,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.75;
    obstacle.lifetime = width/6;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  main.changeAnimation("running",main_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
}
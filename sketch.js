//declarando as variáveis
var trex,trex_running, trex_collide;
var edges;
var solo,solo_image;
var solo2
var Imagemnuvem
var cactoimg1, cactoimg2, cactoimg3, cactoimg4, cactoimg5, cactoimg6;
const play = 1
const end = 0
let gameState = play
var nuvemgp
var cactogp
var gameOver,gamerOverimg
var recomecar, recomecarimg
var somCheckPoint
var somdie
var somjump
var score = 0
var recorde = 0
//preload carrega as mídias do jogo
function preload(){
  //carregando a animação do trex correndo
  trex_running = loadAnimation("images/trex3.png","images/trex4.png");
  trex_collide = loadAnimation("images/trex_collided.png")
  solo_image= loadImage("images/ground2.png");
  //carregando a imagem do solo
  gameOverimg= loadImage("images/gameOver.png")
  recomecarimg=loadImage("images/restart.png")
  Imagemnuvem =loadImage("images/cloud.png");

  cactoimg1 = loadImage("images/obstacle1.png");
  cactoimg2 = loadImage("images/obstacle2.png");
  cactoimg3 = loadImage("images/obstacle3.png");
  cactoimg4 = loadImage("images/obstacle4.png");
  cactoimg5 = loadImage("images/obstacle5.png");
  cactoimg6 = loadImage("images/obstacle6.png");

  somCheckPoint = loadSound("sounds/checkPoint.mp3")
  somdie = loadSound("sounds/die.mp3")
  somjump = loadSound("sounds/jump.mp3")
}


//setup faz a configuração
function setup(){
  createCanvas(windowWidth,windowHeight);

  //sprite trex
  trex = createSprite(50,height-20,20,40);
  trex.addAnimation('running',trex_running);
  trex.addAnimation("collide",trex_collide);
  trex.scale = 0.5;
  trex.debug= false
  //trex.setCollider("rectangle",-10,0,100,30,120)
  trex.setCollider("circle",-10,0,30)
  //sprite Solo
  solo = createSprite(width/2,height-20);
  solo.addImage(solo_image);
  solo.scale = 1.5
  solo2 = createSprite(width/2,height-10,width,5);
  solo2.visible=false;
  //criando bordas
  edges = createEdgeSprites()
  
  gameOver = createSprite(width/2,height-100)
  gameOver.addImage(gameOverimg)
  gameOver.scale= 0.5
  gameOver.visible = false
  recomecar= createSprite(width/2,height-50)
  recomecar.addImage(recomecarimg)
  recomecar.scale= 0.5
  recomecar.visible= false
  nuvemgp = new Group()

  cactogp = new Group()
}

//draw faz o movimento, a ação do jogo
function draw() {
  background("white");

  if(trex.isTouching(cactogp) && gameState == play){
    somdie.play()
    gameState = end
    trex.changeAnimation("collide")
    
  }

  if (gameState == play) {
    //pulo do trex
    if ((keyDown("space")|| touches.length>0) && trex.y > height-36) {
      trex.velocityY = -10;
      somjump.play()
      touches = []
    }
    //movimento do solo
    solo.velocityX = -(2 + score/100);
    score = score + Math.round(getFrameRate()/60)
    if(score%100 == 0 && score>0){
      somCheckPoint.play()
    }
    if (solo.x < 0) {
      solo.x = solo.width / 2;
    }
    gerarNuvem()

    gerarCactos()
  }

  if (gameState == end) {
    solo.velocityX = 0;
    cactogp.setVelocityXEach(0)
    nuvemgp.setVelocityXEach(0)
    cactogp.setLifetimeEach(-1)
    nuvemgp.setLifetimeEach(-1)
    gameOver.visible= true
    recomecar.visible= true
    if(mousePressedOver(recomecar)|| touches.length > 0){
      reset()
      touches = []
    }
    if(recorde<score){
      recorde = score
    }
  }


  gravity();

  //colisão do trex
  trex.collide(solo2);

  text("score: "+ score,width-80,height-190)
  text("recorde: " + recorde,10,height-190)
  //coordenadas do mouse na tela
  text("X: " + mouseX + " / Y: " + mouseY, mouseX, mouseY)
  drawSprites();
}

function gravity(){
  trex.velocityY += 0.5;
}

function gerarNuvem(){

  if(frameCount % 60 === 0){
    var nuvem = createSprite(width,100,40,10);
    nuvem.velocityX = -(3 + score/100);
    nuvem.addImage(Imagemnuvem);
    nuvem.y = Math.round(random(height-190,height-100));
    nuvem.scale= random(0.3,0.8);
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    nuvem.lifetime = width/nuvem.velocityX ;
    nuvemgp.add(nuvem);
  }


}

function gerarCactos(){

if (frameCount % 100 === 0){
var cacto = createSprite(width,height-30,40,10);
cacto.velocityX = -(3+ score/100);
var sorteiocacto = Math.round(random(1,6))
switch (sorteiocacto) {
  case 1: cacto.addImage(cactoimg1)
     break;
    case 2: cacto.addImage(cactoimg2)
     break;
     case 3: cacto.addImage(cactoimg3)
     break;
     case 4: cacto.addImage(cactoimg4)
     break;
     case 5: cacto.addImage(cactoimg5)
     break;
     case 6: cacto.addImage(cactoimg6)
     break;
}
cacto.scale = 0.4
cacto.lifetime = width/cacto.velocityX
cactogp.add(cacto);
}

}

function reset(){
  gameState = play
  recomecar.visible = false
  gameOver.visible = false
  cactogp.destroyEach()
  nuvemgp.destroyEach()
  trex.changeAnimation("running")
  score= 0
}
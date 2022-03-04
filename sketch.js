const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var rope, rope2, rope3
var fruit
var bg_img, food, bunny_img, bunny
var link1, link2, link3
var btn1, btn2, btn3, air_btn, mute_btn
var blink 
var eat
var sad
var Bk_sound, air_sound, sad_sound, eat_sound, cut_sound
var canW, canH


function preload(){
  bg_img = loadImage("./assets/background.png")
  food = loadImage("./assets/melon.png")
  bunny_img = loadImage("./assets/Rabbit-01.png")
  blink = loadAnimation("./assets/blink_1.png","./assets/blink_2.png","./assets/blink_3.png");
  eat = loadAnimation("./assets/eat_0.png", "./assets/eat_1.png","./assets/eat_2.png","./assets/eat_3.png","./assets/eat_4.png");
  sad = loadAnimation("./assets/sad_1.png","./assets/sad_2.png","./assets/sad_3.png");
  blink.playing = true; 
  eat.playing = true; 
  sad.playing = true; 
  sad.looping = false; 
  eat.looping = false;
  Bk_sound = loadSound("./assets/sound1.mp3")
  air_sound = loadSound("./assets/air.wav")
  sad_sound = loadSound("./assets/sad.wav")
  eat_sound = loadSound("./assets/eating_sound.mp3")
  cut_sound = loadSound("./assets/rope_cut.mp3")
}

function setup() 
{ 
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if (isMobile) {
    canW = displayWidth
    canH = displayHeight
    createCanvas(displayWidth+80, displayHeight);
  } else {
    canW = displayWidth
    canH = displayHeight
    createCanvas(displayWidth, displayHeight);
  }
  
  frameRate(80);
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200,canH,600,20);

  Bk_sound.play()
  Bk_sound.setVolume (0.01)

  btn1 = createImg("./assets/cut_btn.png")
  btn1.size(50,50)
  btn1.position(20,30)
  btn1.mouseClicked(drop)

  btn2 = createImg("./assets/cut_btn.png")
  btn2.size(50,50)
  btn2.position(330,35)
  btn2.mouseClicked(drop2)

  btn3 = createImg("./assets/cut_btn.png")
  btn3.size(50,50)
  btn3.position(370,200)
  btn3.mouseClicked(drop3)


  air_btn = createImg("./assets/balloon.png")
  air_btn.size(150, 100)
  air_btn.position(10,250)
  air_btn.mouseClicked(airBlow)

  mute_btn = createImg("./assets/mute.png")
  mute_btn.size(50, 50)
  mute_btn.position(450,20)
  mute_btn.mouseClicked(mute)

  rope = new Rope(6, {x:40, y:30})
  rope2 = new Rope(6, {x:370, y:40})
  rope3 = new Rope(6, {x:400, y:225})
  var fruit_options = {
    density: 0.001
  }
  fruit = Bodies.circle(300, 300, 15, fruit_options)
  Matter.Composite.add(rope.body, fruit)
  link1 = new Link(rope, fruit)
  link2 = new Link(rope2, fruit)
  link3 = new Link(rope3, fruit)

  blink.frameDelay = 20
  eat.frameDelay = 20
  sad.frameDelay = 20

  bunny = createSprite(120,canH-80,100,100)
  bunny.addAnimation("blinking", blink)
  bunny.scale = 0.2
  bunny.addAnimation("eating", eat)
  bunny.addAnimation("crying", sad)
  bunny.changeAnimation("blinking")
  //bunny.changeAnimation("eating")
  //bunny.changeAnimation("crying")
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  imageMode (CENTER)
}

function draw() 
{
  background(51);
  image(bg_img, width/2, height/2, width, height)
  ground.show();
  rope.show()
  rope2.show()
  rope3.show()

  if (fruit !== null) {
      image(food, fruit.position.x, fruit.position.y, 70,70)

  }

  if (collide(fruit, bunny)) {
    bunny.changeAnimation("eating")
    eat_sound.play()
  }

  if (fruit !== null && fruit.position.y >= 650) {
    bunny.changeAnimation("crying")
    sad_sound.play()
    Bk_sound.stop()
    fruit = null
  }
  Engine.update(engine);
  
  
 
   drawSprites()
}

function drop(){
  rope.break()
  link1.detach()
  link1 = null
  cut_sound.play()
}

function drop2(){
  rope2.break()
  link2.detach()
  link2 = null
  cut_sound.play()
}

function drop3(){
  rope3.break()
  link3.detach()
  link3 = null
  cut_sound.play()
}


function collide(body, sprite){
  if (body !== null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y)
    if (d <= 80) {
      World.remove(world, fruit)
      fruit = null
      return true
    } else{
      return false
    }
  } 
}

function airBlow(){
  Matter.Body.applyForce(fruit, {x:0, y:0},{x:0.01, y:0})
  air_sound.play()
}

function mute(){
  if (Bk_sound.isPlaying()) {
    Bk_sound.stop()
  } else {
    Bk_sound.play()
  }
}
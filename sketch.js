//inkBlots; january, 2025. 

//http://127.0.0.1:3000/25-02-02_inkTypePlay/index.html

/*
approach:

1) when you create an ink blot, you first put down a circle (this, i later want to change to a 'blob'). 
2) then, particles from that blob move outwards. noise acts on them, causing them to move / flow randomly (but in a smooth fashion). 
3) (eventually), when any particle reaches the edge, it should be removed from the computing array and the visual still remains (because the background is not drawn again). i still have to add this function. 

*/

let particles = []; 

var textToPoints = []; 

let font; 

let minSize = 2; 
let maxSize = 8; 

var timerNumber = 300; 

function preload(){
font = loadFont ('CrimsonText-Regular.ttf'); 
}

function setup() {
createCanvas(1240, 1754); //in 16:9 aspect ratio. 
rectMode (CENTER); //to center the text box. 
angleMode (DEGREES); //use degrees instead of radians. 

background (255); //white background, change to texture if needed. 

fill (0, 100); 
textLeading (48*2); 
textToPoints = convertLetterToPoints("if what i write \n means nothing to anyone,\n why should i \n write anything at all?", width/2+417, height/2-15, width, height, 5, 42, font, LEFT, CENTER);

}

function draw() {

if (frameCount%timerNumber==0){
var n = int(random(0, textToPoints.length)); 
createInkBlotParticles(textToPoints[n].x, textToPoints[n].y, int(random(minSize, maxSize))); 

timerNumber = random([60, 120, 180, 240, 300, 360, 420, 480]); 
}

for (let particle of particles){
particle.display(); 
particle.move(); 
}

}


function mousePressed(){
//createInkBlotParticles(mouseX, mouseY, int(random(8, 40))); 
save ('frame.webp'); 
}

function createInkBlotParticles(centerX, centerY, radius){
//run through 0 to 360 degrees and create a particle at each. 

for (let i = 0; i<=360; i++){
let angle = degrees(i); 
let x = centerX + sin(angle)*radius;
let y = centerY + cos(angle)*radius;

particles.push(new Particle(x, y, angle, radius, centerX, centerY)); 

}

}

class Particle{
constructor(x, y, angle, radius, centerX, centerY){
this.x = x; 
this.y = y; 
this.angle = angle; 
this.radius = radius; 
this.centerX = centerX; 
this.centerY = centerY;


}

display(){
strokeWeight (this.radius); 
stroke (0, 5); 
noFill(); 

point (this.x, this.y);

}

move(){
const scaleMax = 4; //scale noise from [0,1] to [0,max]. 
const noiseRangeShift = scaleMax/2; //shift range from [0,max] to [-max/2, max/2]. 
const spreadSpeed = 0.5; 

let noiseX = noise(this.x*0.01, this.y*0.01)*scaleMax - noiseRangeShift;
let noiseY = noise(this.y*0.01, this.x*0.01)*scaleMax - noiseRangeShift; 

this.x+=sin(this.angle)*spreadSpeed + noiseX; 
this.y+=sin(this.angle)*spreadSpeed + noiseY; 

}

}
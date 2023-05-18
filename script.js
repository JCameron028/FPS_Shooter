// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 900;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
let gameSpeed = 1;

// Mouse interactions
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function(){
    mouse.click = false;
})

// Player
const playerLeft = new Image();
playerLeft.src = 'redDragon_Left.png';
const playerRight = new Image();
playerRight.src = 'redDragon_Right.png';
const playerUp = new Image();
playerUp.src = 'redDragon_Up.png';
const playerDown = new Image();
playerDown.src = 'redDragon_Down.png';

class Player {
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 145;
        this.spriteHeight = 130;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if (mouse.x != this.x) {
            this.x -= dx/30;
        }
        if (mouse.y != this.y) {
            this.y -= dy/30;
        }
    }
    draw(){
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10);
        if (this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
                this.x - 100, this.y - 100, this.spriteWidth*1.5, this.spriteHeight*1.5);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
           this.x - 100, this.y - 100, this.spriteWidth*1.5, this.spriteHeight*1.5);
        }
        if (frameX < 3) frameX++;
        else frameX = 0;

        gameFrame++;

        /*ctx.save();
        ctx.translate(this.x, this.y);*/        
    }
}
const player = new Player();

// Targets
const targetsArray = [];
const targetImage = new Image();
targetImage.src = 'rideLeft.png';
const spriteWidth = 245;
const spriteHeight = 200;
let frameX = 0;
let frameY = 0;
class Target {
    constructor(){
        this.x = canvas.width + 100;
        this.y = Math.random() * canvas.height;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    update(){
        this.x -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10);
        ctx.stroke();
        ctx.drawImage(targetImage, 0, 0, frameX * spriteWidth, frameY * spriteHeight, 0, 0, spriteWidth, spriteHeight);
        if (frameX < 7) frameX++;
        else frameX = 0;

        gameFrame++;
        requestAnimationFrame(animate);
    }
}

const targetExplosion1 = document.createElement('audio');
targetExplosion1.src = 'shortExplosion.wav';
const targetExplosion2 = document.createElement('audio');
targetExplosion2.src = 'explosionBoom.wav';

function handleTargets(){
    if (gameFrame % 50 == 0){
        targetsArray.push(new Target());        
    }
    for (let i = 0; i < targetsArray.length; i++){
        targetsArray[i].update();
        targetsArray[i].draw();  
        if (targetsArray[i].x < 0 - targetsArray[i].radius * 2){
            targetsArray.splice(i, 1);
            i--;
        } else if (targetsArray[i].distance < targetsArray[i].radius + player.radius){
            if (!targetsArray[i].counted){
                if (targetsArray[i].sound == 'sound1'){
                    targetExplosion1.play();                    
                } else {
                    targetExplosion2.play();
                }
                score++;
                targetsArray[i].counted = true;
                targetsArray.splice(i, 1);
                i--;
            }            
        }        
    }
    for (let i = 0; i < targetsArray.length; i++){            
    }              
}            

// Repeating Backgrounds
const background = new Image();
background.src = '031.png';

function handleBackground(){
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}
// Animation loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleTargets();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('score:' + score, 10, 50);
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();

});

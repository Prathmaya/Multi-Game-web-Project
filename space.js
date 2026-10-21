let spaceScore=0;
let player={x:180, y:360,width:40,height:10,speed:5};
let bullets=[];
let enemies=[];
let enemyRows=3;
let enemyCols=6;
let spaceInterval=null;
function initSpaceGame(){
    spaceScore=0;
    player.x=180;
    bullets=[];
    enemies=[];
    for (let r=0; r<enemyRows; r++){
        for (let c=0; c<enemyCols;c++){
            enemies.push({
                x:30+c*55,
                y:30+r*35,
                width:35,
                height:20,
                alive: true
            });
        }
    }
}
function updateSpace(){
    bullets.forEach((b, index)=>{
        b.y-=7;
        if (b.y<0)bullets.splice(index,1);
    });
    bullets.forEach((b, bIndex)=>{
        enemies.forEach((e)=>{
            if (e.alive && b.x> e.x && b.x < e.x + e.width && b.y> e.y && b.y < e.y + e.height){
                e.alive=false;
                bullets.splice(bIndex,1);
                spaceScore+=20;
                document.getElementById("score").innerText=spaceScore;
            }
        });
    });
}
function drawSpace(){
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#6600ff";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle="#ffff00";
    bullets.forEach((b)=> ctx.fillRect(b.x,b.y,4,10));
    ctx.fillStyle="#ff0055";
    enemies.forEach((e)=>{
        if (e.alive) ctx.fillRect(e.x,e.y,e.width,e.height);
    });
}
function spaceGameLoop(){
    updateSpace();
    drawSpace();
}
window.addEventListener("keydown",(e)=>{
    if (e.key==="ArrowLeft" && player.x>0){
        player.x-=player.speed;
    }else if (e.key==="ArrowRight" && player.x<canvas.width-player.width){
        player.x+=player.speed;
    }else if (e.key===" " ||e.key==="Spacebar"){
        bullets.push({x:player.x+player.width/2-2,y:player.y});
    }
});
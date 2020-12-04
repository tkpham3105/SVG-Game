// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}


// The player class used in this program
function Player() {
    this.node = document.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
}

Player.prototype.isOnPlatform = function() {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
             ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
             (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideVerticalPlatform = function(position) {
    var verPlatform = document.getElementById("movePlatform");
    var x = parseFloat(verPlatform.getAttribute("x"));
    var y = parseFloat(verPlatform.getAttribute("y"));
    var w = parseFloat(verPlatform.getAttribute("width"));
    var h = parseFloat(verPlatform.getAttribute("height"));
    var pos = new Point(x, y);
    var size = new Size(w, h - 20);

    if (intersect(position, PLAYER_SIZE, pos, size)) {
        position.x = this.position.x;
        if (intersect(position, PLAYER_SIZE, pos, size)) {
            if (this.position.y >= y + h - 20)
                position.y = y + h;
            else
                position.y = y - PLAYER_SIZE.h;
            this.verticalSpeed = 0;
        }
    }
}

Player.prototype.isOnVerticalPlatform = function() {
    var platform = document.getElementById("movePlatform");
    var x = parseFloat(platform.getAttribute("x"));
    var yMax = parseFloat(platform.getAttribute("y"))+5.0;
    var yMin = parseFloat(platform.getAttribute("y"))-5.0;
    var w = parseFloat(platform.getAttribute("width"));
    var h = parseFloat(platform.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
             ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
             (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            (this.position.y + PLAYER_SIZE.h < yMax)&&(this.position.y + PLAYER_SIZE.h > yMin)) return true;
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}


Player.prototype.collideDisappearPlatform = function(position) {
    
    for (var i = 1; i <=3; i++) {
        if(periods[i]>PERIOD+1000){
            continue;
        }
        var disappearingPlatform = document.getElementById("vanishPlat0"+String(i));
        //if (disappearingPlatform.nodeName != "rect") continue;
        var x = parseFloat(disappearingPlatform.getAttribute("x"));
        var y = parseFloat(disappearingPlatform.getAttribute("y"));
        var w = parseFloat(disappearingPlatform.getAttribute("width"));
        var h = parseFloat(disappearingPlatform.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
                if(disappearingPlatform != previousPlatform){
                    periods[i]=0;
                    period = PERIOD;
                    previousPlatform = disappearingPlatform;
                }else{
                    if(periods[i]>=PERIOD){
                        periods[i]=PERIOD+2000;
                        //document.getElementById("disappearPlatform"+String(i)).setAttribute("opacity","1.0");
                        document.getElementById("vanishPlat0"+String(i)).style.setProperty("visibility","hidden");
                    }else{
                        periods[i]+=GAME_INTERVAL;
                        var temp = 1.0-periods[i]*1.0/PERIOD;
                        document.getElementById("vanishPlat0"+String(i)).style.setProperty("opacity",String(temp));
                    }                
                }
            }
        }
    }
}


//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var BULLET_SIZE = new Size(10, 10);         // The size of a bullet
var MONSTER_SIZE = new Size(40, 40);        // The size of a monster
var EXIT_SIZE = new Size(40,50);            // The size of exit gate
var GOODTHING_SIZE = new Size(40,40);          // The size of candy

var NUM_BULLET = 8;                       // total number of bullets player can shoot

var PLAYER_INIT_POS  = new Point(0, 0);     // The initial position of the player

var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var VERTICAL_DISPLACEMENT = 2;              // The displacement of vertical speed

var timer;
var PLATFORM_SPEED = 1.0;                   // The speed of vertical platforom
var MONSTER_SPEED = 1.0;                    // The speed of a monster
var BULLET_SPEED = 10.0;                    // The speed of a bullet
var JUMP_SPEED = 15;                        // The speed of the player jumping
                                            //  = pixels it moves each game loop
var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
var GAME_INTERVAL = 25;                     // The time interval of running the game
var DURATION = 300000;                      // Time duration of game


var NUM_MONSTER = 6;
var NUM_GOOD_THING = 8;

var PERIOD = 500; //Disappearing platform
var PLATFORM_START = new Point(340,320);
var PLATFORM_END = new Point(340,460);
//
// Variables in the game 
//
var motionType = {NONE:0, LEFT:1, RIGHT:2}; // Motion enum

var startAgain = false;
var player = null;                          // The player object
var gameInterval = null;                    // The interval
var zoom = 1.0;                             // The zoom level of the screen

var isCheating = false;             // A flag indicating whether the player is on cheating mode
var canShoot = true;                // A flag indicating whether the player can shoot a bullet
var monsterCanShoot = true;         // A flag indicating whether the monster can shoot a bullet 
var score = 0;

var starts = [];                       // list contains original coordinates of monsters
var dests = [];                          // list contains i-th destination coordinates for i-th monster to move to
var done_move_forward = [];              // helper list helps to determine whether monsters move back or forward
var done_move_forward_flip = [];         // helper list helps to determine whether monsters_flip move back or forward
var platform_done_move_forward = false;

var endgame_stat = false;                       // status of the game
var id_monster_bullet;    // id of the monster can shoot bullet
var bullMonster_alive = true;            // check whether the monster with bullet is killed by player or not
var duration = DURATION;
var upLevel = false;
var level = 1;
var bullets_motionType = [];             // helper list helps determine bullet's motion type 
var numBullet = NUM_BULLET;               // track how many bullet left
var bullMonster_motionType = [];
var track_num_green_bullet = 0;
var periods=[0,0,0];
var period = PERIOD;
var previousPlatform;
var num_monster;

var bgSound;
var loseSound;
var monsterSound;
var passSound;
var shootSound;

// Should be executed after the page is loaded
function load() {
    //sound
    bgSound = document.getElementById("bgSound");
    loseSound = document.getElementById("loseSound");
    monsterSound = document.getElementById("monsterSound");
    passSound = document.getElementById("passSound");
    shootSound = document.getElementById("shootSound");
    
    // bgSound.pause();
    bgSound.play();
    bgSound.volume =0.5;
    bgSound.loop = true;
    duration = DURATION;
    countDown();
    // the game begin
    document.getElementById("Start_Again").style.setProperty("visibility", "hidden", null);
    document.getElementById("gamearea").style.setProperty("visibility", "visible", null);
    document.getElementById("inGameObj").style.setProperty("visibility", "visible", null);
    document.getElementById("startBtn").style.setProperty("visibility", "hidden", null);
    document.getElementById("highscoretable").style.setProperty("visibility", "hidden", null);
    document.getElementById("startScr").style.setProperty("visibility", "hidden", null);
    document.getElementById("player_right").style.setProperty("visibility", "visible", null);
    document.getElementById("player_left").style.setProperty("visibility", "hidden", null);
    document.getElementById("numBullet").innerHTML = numBullet;
    // Attach keyboard events
    document.addEventListener("keydown", keydown, false);
    document.addEventListener("keyup", keyup, false);
    if (startAgain) {
        level = 1;
        isCheating = false;
        score = 0;
        document.getElementById("cheatMode").innerHTML = "Cheat: Off";
        document.getElementById("score").innerHTML = score;
        document.getElementById("level").innerHTML = level;
        updateScreen();
    }
    // Create the player
    player = new Player();
    if(level==1){
        num_monster = NUM_MONSTER;
        var character_name = prompt("Please enter the name you want for your in-game character", "");
        if (character_name != "" && character_name != null)
            document.getElementById("character_name").innerHTML = character_name;
    }
    else{
        num_monster = NUM_MONSTER+4*(level-1); //adding 4 monsters in each level
    }
    // Create the monsters
    var i = 0;
    while(i < num_monster) {
        var start_x = Math.floor(Math.random() * 560);
        var start_y = Math.floor(Math.random() * 520);
        if (starts.indexOf((start_x, start_y)) == -1 && start_y > 80) {
            createMonster(start_x, start_y, i);
            starts.push(new Point(start_x, start_y));
            i += 1;
        }
    }

    var j = 0;
    while(j < num_monster) {
        var dest_x = Math.floor(Math.random() * 560);
        var dest_y = Math.floor(Math.random() * 520);
        if (dests.indexOf((dest_x, dest_y)) == -1) {
            dests.push(new Point(dest_x, dest_y));
            j += 1;
        }
    }
    id_monster_bullet = "monster" + String(Math.floor(Math.random()*num_monster));
    initial_monster();

    for (var k = 0; k < num_monster; k++)
        done_move_forward.push(false);

    var k = 0;
    var check_dup_gthing = [];
    while(k < NUM_GOOD_THING) {
        var x = Math.floor(Math.random() * 560);
        var y = Math.floor(Math.random() * 520);
        var positionTemp = new Point(x,y);
        if (check_dup_gthing.indexOf((x,y)) == -1 && !overlapPlatform(positionTemp)) {
            createGoodThing(x, y);
            k += 1;
        }
    }
    for (var i = 1; i <=3; i++) {
        document.getElementById("vanishPlat0"+String(i)).style.setProperty("opacity", "1");
        document.getElementById("vanishPlat0"+String(i)).style.setProperty("visibility", "visible");
    }
    // Start the game interval
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);

}
//Time remaining
function countDown() {
    timer = setInterval(function() {
        if(duration==0) {
            // clearInterval(timer);
            endgame_stat = true;
        }
        else {
            document.getElementById("time").innerHTML = duration/1000;
            duration-=1000;
        }
    },1000);
}

function endgame() {
    loseSound.play();
    bgSound.pause();
    clearGame();
}


function clearGame(){
    document.removeEventListener("keydown", keydown);
    document.removeEventListener("keyup", keyup);
    clearInterval(timer);
    clearInterval(gameInterval);
    // clear all remaining 
    var gifts = document.getElementById("goodthings");
    pre_gifts = gifts.childNodes.length;
    for (var j = 0; j < pre_gifts; j++) {
        var gift = gifts.childNodes.item(0);
        gifts.removeChild(gift);
    }

    var monsters = document.getElementById("monsters");
    pre_monsters = monsters.childNodes.length;
    for (var j = 0; j < pre_monsters; j++) {
        var monster = monsters.childNodes.item(0);
        monsters.removeChild(monster);
    }

    var monstersFlip = document.getElementById("monsters_flip");
    preMonstersFlip = monstersFlip.childNodes.length;
    for (var j = 0; j < preMonstersFlip; j++) {
        var monsterFlip = monstersFlip.childNodes.item(0);
        monstersFlip.removeChild(monsterFlip);
    }

    var bullets = document.getElementById("bullets");
    pre_bullets = bullets.childNodes.length;
    for (var j = 0; j < pre_bullets; j++) {
        var bullet = bullets.childNodes.item(0);
        bullets.removeChild(bullet);
    }

    var monster_bullets = document.getElementById("monster_bullets");
    pre_monster_bullets = monster_bullets.childNodes.length;
    for (var j = 0; j < pre_monster_bullets; j++) {
        var monster_bullet = monster_bullets.childNodes.item(0);
        monster_bullets.removeChild(monster_bullet);
    }

    document.getElementById("player_right").style.setProperty("visibility", "hidden", null);
    document.getElementById("player_left").style.setProperty("visibility", "hidden", null);

    // for (var i = 1; i <=3; i++) {
    //     document.getElementById("vanishPlat0"+String(i)).style.setProperty("opacity", "visible");
    // }
    starts = [];                       // list contains original coordinates of monsters
    dests = [];                          // list contains i-th destination coordinates for i-th monster to move to
    done_move_forward = [];              // helper list helps to determine whether monsters move back or forward
    done_move_forward_flip = [];
    bullMonster_alive = true;
    periods=[0,0,0];
    numBullet = NUM_BULLET;
    bullets_motionType = [];
    bullMonster_motionType = []; 
}


//
// This function creates good things
//
function createGoodThing(x, y) {
    
    var good_thing = document.createElementNS("http://www.w3.org/2000/svg", "use");
    good_thing.setAttribute("x", x);
    good_thing.setAttribute("y", y);
    good_thing.setAttribute("visibility", "visible");
    good_thing.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#goodthing");
    document.getElementById("goodthings").appendChild(good_thing);
}


//
// This function decide the initial appearance of monster
//
function initial_monster() {
    for (var i = 0; i < num_monster; i++) {
        if (starts[i].x <= dests[i].x) {
            document.getElementById("monster_flip"+String(i)).setAttribute("visibility", "visible");
            document.getElementById("monster"+String(i)).setAttribute("visibility", "hidden");
        }
        else {
            document.getElementById("monster_flip"+String(i)).setAttribute("visibility", "hidden");
            document.getElementById("monster"+String(i)).setAttribute("visibility", "visible");
        }
    }
}


//
// This function creates the monsters in the game
//
function createMonster(x, y, id) {
    var monster = document.createElementNS("http://www.w3.org/2000/svg", "use");
    monster.setAttribute("id", "monster"+String(id));
    monster.setAttribute("x", x);
    monster.setAttribute("y", y);
    monster.setAttribute("visibility", "visible");
    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
    document.getElementById("monsters").appendChild(monster);

    var monster_flip = document.createElementNS("http://www.w3.org/2000/svg", "use");
    monster_flip.setAttribute("id", "monster_flip"+String(id));
    monster_flip.setAttribute("x", x);
    monster_flip.setAttribute("y", y);
    monster_flip.setAttribute("visibility", "hidden");
    monster_flip.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster_flip");
    document.getElementById("monsters_flip").appendChild(monster_flip);
}

function flipMonster(id) {
    monster = document.getElementById("monster"+String(id));
    monster_flip = document.getElementById("monster_flip"+String(id));
    if (monster.getAttribute("visibility") == "visible") {
        monster.setAttribute("visibility", "hidden");
        monster_flip.setAttribute("visibility","visible");
    }
    else {
        monster.setAttribute("visibility", "visible");
        monster_flip.setAttribute("visibility","hidden");
    }
}

//
// This function updates the position of the monsters
//
function moveMonsterUL(monster) {
    var x = parseInt(monster.getAttribute("x"));
    var y = parseInt(monster.getAttribute("y"));
    monster.setAttribute("x", x - MONSTER_SPEED);
    monster.setAttribute("y", y - MONSTER_SPEED);
}
function moveMonsterUR(monster) {
    var x = parseInt(monster.getAttribute("x"));
    var y = parseInt(monster.getAttribute("y"));
    monster.setAttribute("x", x + MONSTER_SPEED);
    monster.setAttribute("y", y - MONSTER_SPEED);
}
function moveMonsterDL(monster) {
    var x = parseInt(monster.getAttribute("x"));
    var y = parseInt(monster.getAttribute("y"));
    monster.setAttribute("x", x - MONSTER_SPEED);
    monster.setAttribute("y", y + MONSTER_SPEED);
}
function moveMonsterDR(monster) {
    var x = parseInt(monster.getAttribute("x"));
    var y = parseInt(monster.getAttribute("y"));
    monster.setAttribute("x", x + MONSTER_SPEED);
    monster.setAttribute("y", y + MONSTER_SPEED);
}   
function moveMonster(i, start, dest, monster) {
    var x = parseInt(monster.getAttribute("x"));
    var y = parseInt(monster.getAttribute("y"));
    if (start.x >= dest.x && start.y >= dest.y) {
        if (x > dest.x && y > dest.y)
            moveMonsterUL(monster);
        else {
            done_move_forward[i] = !done_move_forward[i];
            flipMonster(i);
        }

    }
    else if (start.x <= dest.x && start.y >= dest.y) {
        if (x < dest.x && y > dest.y)
            moveMonsterUR(monster);
        else {
            done_move_forward[i] = !done_move_forward[i];
            flipMonster(i);
        }
    }
    else if (start.x >= dest.x && start.y <= dest.y) {
        if (x > dest.x && y < dest.y)
            moveMonsterDL(monster);
        else {
            done_move_forward[i] = !done_move_forward[i];
            flipMonster(i);
        }
    }
    else {
        if (x < dest.x && y < dest.y)
            moveMonsterDR(monster);
        else {
            done_move_forward[i] = !done_move_forward[i];
            flipMonster(i);
        }
    }
}
function moveMonsterFlip(i, start, dest, monster) {
    var x = parseInt(monster.getAttribute("x"));
    var y = parseInt(monster.getAttribute("y"));
    if (start.x >= dest.x && start.y >= dest.y) {
        if (x > dest.x && y > dest.y)
            moveMonsterUL(monster);
        else {
            done_move_forward_flip[i] = !done_move_forward_flip[i];
        }

    }
    else if (start.x <= dest.x && start.y >= dest.y) {
        if (x < dest.x && y > dest.y)
            moveMonsterUR(monster);
        else {
            done_move_forward_flip[i] = !done_move_forward_flip[i];
        }
    }
    else if (start.x >= dest.x && start.y <= dest.y) {
        if (x > dest.x && y < dest.y)
            moveMonsterDL(monster);
        else {
            done_move_forward_flip[i] = !done_move_forward_flip[i];
        }
    }
    else {
        if (x < dest.x && y < dest.y)
            moveMonsterDR(monster);
        else {
            done_move_forward_flip[i] = !done_move_forward_flip[i];
        }
    }
} 

//
// This function shoots a bullet from the player
//
function shootBullet() {
    // Disable shooting for a short period of time
    canShoot = false;
    setTimeout("canShoot = true", SHOOT_INTERVAL);

    // Create the bullet using the use node
    var bullet = document.createElementNS("http://www.w3.org/2000/svg", "use");

    // Calculate and set the position of the bullet
    bullet.setAttribute("x", player.position.x + PLAYER_SIZE.w / 2 - BULLET_SIZE.w / 2);
    bullet.setAttribute("y", player.position.y + PLAYER_SIZE.h / 2 - BULLET_SIZE.h / 2);

    // Set the href of the use node to the bullet defined in the defs node
    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
    bullet.setAttribute("id","bullet_num"+String(NUM_BULLET-numBullet));
    if(document.getElementById("player_right").style.getPropertyValue("visibility") == "visible" &&
        document.getElementById("player_left").style.getPropertyValue("visibility") == "hidden")
        bullets_motionType.push(new Point(8-numBullet,1));
    if (document.getElementById("player_right").style.getPropertyValue("visibility") == "hidden" &&
        document.getElementById("player_left").style.getPropertyValue("visibility") == "visible")
        bullets_motionType.push(new Point(8-numBullet,0));
    // Append the bullet to the bullet group
    document.getElementById("bullets").appendChild(bullet);
    shootSound.play();
}


//
// This function shoots a bullet from the monster
//
function monsterShootBullet() {
    // determine monster-with-bullet's position
    monster_with_bullet = document.getElementById(id_monster_bullet);
    x = parseInt(monster_with_bullet.getAttribute("x"));
    y = parseInt(monster_with_bullet.getAttribute("y"));
    // Disable shooting for a short period of time
    monsterCanShoot = false;
    
    time_for_next_bullet = 0;
    // Create the bullet using the use node
    var monster_bullet = document.createElementNS("http://www.w3.org/2000/svg", "use");

    // Calculate and set the position of the bullet
    monster_bullet.setAttribute("x", x + MONSTER_SIZE.w / 2 - BULLET_SIZE.w / 2);
    monster_bullet.setAttribute("y", y + MONSTER_SIZE.h / 2 - BULLET_SIZE.h / 2);

    // Set the href of the use node to the bullet defined in the defs node
    monster_bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster_bullet");
    monster_bullet.setAttribute("id","green_bullet_num"+String(track_num_green_bullet));
    if(document.getElementById(id_monster_bullet).getAttribute("visibility") == "visible") {
        bullMonster_motionType.push(new Point(track_num_green_bullet,0));
    }
    else {
        bullMonster_motionType.push(new Point(track_num_green_bullet,1));
        time_for_next_bullet = (SCREEN_SIZE.w - x) / BULLET_SPEED * GAME_INTERVAL;
    }
    if (SCREEN_SIZE.w - x > x)
        time_for_next_bullet = (SCREEN_SIZE.w - x) / BULLET_SPEED * GAME_INTERVAL;
    else 
        time_for_next_bullet = x / BULLET_SPEED * GAME_INTERVAL;
    setTimeout("monsterCanShoot = true", time_for_next_bullet);
    // Append the bullet to the bullet group
    document.getElementById("monster_bullets").appendChild(monster_bullet);
    track_num_green_bullet++;
}


//
// This function helps get motion type of bullet
//
function getMotionTypeBullet(id) {
    for (var i = 0; i < NUM_BULLET; i++) {
        if (bullets_motionType[i].x == id) 
            return bullets_motionType[i].y;
    }
    return -1;
} 


//
// This function helps get motion type of monster bullet 
//
function getMotionTypeGreenBullet(id) {
    for (var i = 0; i < track_num_green_bullet; i++) {
        if (bullMonster_motionType[i].x == id) 
            return [i,bullMonster_motionType[i].y];
    }
    return -1;
}

//
// This function updates the position of the bullets
//
function moveBullets() {
    // Go through all bullets
    var bullets = document.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        var node_id = parseInt(node.getAttribute("id").slice(-1));
        if (getMotionTypeBullet(node_id) == 1) {
            // Update the position of the bullet
            var x = parseInt(node.getAttribute("x"));
            node.setAttribute("x", x + BULLET_SPEED);

            // If the bullet is not inside the screen delete it from the group
            if (x > SCREEN_SIZE.w) {
                bullets.removeChild(node);
                i--;
            }
        }
        if (getMotionTypeBullet(node_id) == 0) {
            // Update the position of the bullet
            var x = parseInt(node.getAttribute("x"));
            node.setAttribute("x", x - BULLET_SPEED);

            // If the bullet is not inside the screen delete it from the group
            if (x < 0) {
                bullets.removeChild(node);
                i--;
            }
        }
    }
    var monster_bullets = document.getElementById("monster_bullets");
    for (var i = 0; i < monster_bullets.childNodes.length; i++) {
        var node = monster_bullets.childNodes.item(i);
        var node_id = parseInt(node.getAttribute("id").slice(-1));
        // Update the position of the bullet
        var x = parseInt(node.getAttribute("x"));
        var res = getMotionTypeGreenBullet(node_id); 
        if (res[1] == 1) {
            node.setAttribute("x", x + BULLET_SPEED);
            // If the bullet is not inside the screen delete it from the group
            if (x > SCREEN_SIZE.w) {
                monster_bullets.removeChild(node);
                bullMonster_motionType.splice(res[0], 1);
                track_num_green_bullet--;
                i--;
            }
        }
        if (res[1] == 0) {
            node.setAttribute("x", x - BULLET_SPEED);
            if (x < 0) {
                monster_bullets.removeChild(node);
                bullMonster_motionType.splice(res[0], 1);
                track_num_green_bullet--;
                i--;
            }
        }
    }
}


//
// This function move a platform vertically
//
function moveVerticalPlatform(){
    var platform = document.getElementById("movePlatform");
    var y = parseInt(platform.getAttribute("y"));
    if(PLATFORM_END.y == y||PLATFORM_START.y == y){
        PLATFORM_SPEED = - PLATFORM_SPEED;
    }
    var temp = y + PLATFORM_SPEED;
    platform.setAttribute("y", temp);
}


//
// This function handle portal transmission
//
function portalTransmission() {
    var portal_1 = document.getElementById("portal1");
    var x1 = parseInt(portal_1.getAttribute("x"));
    var y1 = parseInt(portal_1.getAttribute("y"));
    var w1 = parseInt(portal_1.getAttribute("width"));
    var h1 = parseInt(portal_1.getAttribute("height"));

    var portal_2 = document.getElementById("portal2");
    var x2 = parseInt(portal_2.getAttribute("x"));
    var y2 = parseInt(portal_2.getAttribute("y"));
    var w2 = parseInt(portal_2.getAttribute("width"));
    var h2 = parseInt(portal_2.getAttribute("height"));

    var px = player.position.x;
    var py = player.position.y;

    if (intersect(new Point(px, py), PLAYER_SIZE, new Point(x1, y1), new Size(w1, h1))) {
        var new_x = x2 - PLAYER_SIZE.w;
        var new_y = y2 + h2 - PLAYER_SIZE.w;
        player.position = new Point(new_x, new_y);
    }

    if (intersect(new Point(px, py), PLAYER_SIZE, new Point(x2, y2), new Size(w2, h2))) {
        var new_x = x1 + w1;
        var new_y = y1 + h2 - PLAYER_SIZE.h;
        player.position = new Point(new_x, new_y);
    }
}


//Handling of good things
function overlapPlatform(position){
    var check = false;
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;
    
        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);
    
        if (intersect(position, GOODTHING_SIZE, pos, size)) {
            check = true;
        }
    }

    var movePlatform = document.getElementById("movePlatform");
    var mx = parseFloat(movePlatform.getAttribute("x"));
    var my = parseFloat(movePlatform.getAttribute("y"));
    var mw = parseFloat(movePlatform.getAttribute("width"));
    var mh = parseFloat(movePlatform.getAttribute("height"));
    var mpos = new Point(mx, my);
    var msize = new Size(mw, mh);
    if (intersect(position, GOODTHING_SIZE, mpos, msize)) {
        check = true;
    }

    var vanPlatforms = document.getElementById("vanishPlats");
    for (var i = 0; i < vanPlatforms.childNodes.length; i++) {
        var node = vanPlatforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;
    
        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);
    
        if (intersect(position, GOODTHING_SIZE, pos, size)) {
            check = true;
        }
    }        

    return check;
}


//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();
    if (endgame_stat == false) {
        switch (keyCode) {
            case "A".charCodeAt(0):
                player.motion = motionType.LEFT;
                document.getElementById("player_left").style.setProperty("visibility", "visible", null);
                document.getElementById("player_right").style.setProperty("visibility", "hidden", null);
                break;
            case "D".charCodeAt(0):
                if (!upLevel) {
                    player.motion = motionType.RIGHT;
                    document.getElementById("player_left").style.setProperty("visibility", "hidden", null);
                    document.getElementById("player_right").style.setProperty("visibility", "visible", null);
                }
                break;			
            case "W".charCodeAt(0):
                if (player.isOnPlatform() || player.isOnVerticalPlatform()) {
                    player.verticalSpeed = JUMP_SPEED;
                }
                break;
            case "H".charCodeAt(0):
                if (canShoot && numBullet > 0) { 
                    shootBullet();
                    numBullet--;
                }
                break;
            case "C".charCodeAt(0):
                isCheating = true;
                document.getElementById("cheatMode").innerHTML ="Cheat: On";
                break;
            case "V".charCodeAt(0):
                isCheating = false;
                document.getElementById("cheatMode").innerHTML = "Cheat: Off";
                break;
        }
    }
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            break;

        case "D".charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;
    }
}


//
// This function checks collision
//
function collisionDetection() {
    // Check whether the player collides with a monster
    var monsters = document.getElementById("monsters");
    var monsters_flip = document.getElementById("monsters_flip");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        if (!isCheating) {
            var monster = monsters.childNodes.item(i);
            var x = parseInt(monster.getAttribute("x"));
            var y = parseInt(monster.getAttribute("y"));

            if (intersect(new Point(x, y), MONSTER_SIZE, player.position, PLAYER_SIZE)) {
                // Clear the game interval

                if(!startAgain){
                    endgame_stat = true;
                    duration = 0;
                    startAgain = true;
                    endgame();
                    display_highscore();
                }

            }
        }
    }


    // Check whether a bullet hits a monster
    var bullets = document.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));

        for (var j = 0; j < monsters.childNodes.length; j++) {
            var monster = monsters.childNodes.item(j);
            var monster_flip = monsters_flip.childNodes.item(j);
            var mx = parseInt(monster.getAttribute("x"));
            var my = parseInt(monster.getAttribute("y"));

            if (intersect(new Point(x, y), BULLET_SIZE, new Point(mx, my), MONSTER_SIZE)) {
                if (monster.getAttribute("id") == id_monster_bullet) {
                    bullMonster_alive = false;
                }
                monsters.removeChild(monster);
                monsters_flip.removeChild(monster_flip);
                j--;
                bullets.removeChild(bullet);
                i--;

                // increase score by 10
                score += 10;
                document.getElementById("score").firstChild.data = score;
                monsterSound.play();
            }
        }
    }

    // Check whether a monster's bullet hits player
    var monster_bullets = document.getElementById("monster_bullets");
    for (var i = 0; i < monster_bullets.childNodes.length; i++) {
        if (!isCheating) {
            var bullet = monster_bullets.childNodes.item(i);
            var x = parseInt(bullet.getAttribute("x"));
            var y = parseInt(bullet.getAttribute("y"));

            if (intersect(new Point(x, y), BULLET_SIZE, player.position, PLAYER_SIZE)) {

                if(!startAgain) {
                    duration = 0;
                    endgame_stat = true;
                    startAgain = true;
                    endgame();
                    display_highscore();
                }

            }
        }
    }

    // Check whether the player collides with a goodthing
    var goodthings = document.getElementById("goodthings");
    for (var i = 0; i < goodthings.childNodes.length; i++) {
        var goodthing = goodthings.childNodes.item(i);
        var x = parseInt(goodthing.getAttribute("x"));
        var y = parseInt(goodthing.getAttribute("y"));

        if (intersect(new Point(x, y), GOODTHING_SIZE, player.position, PLAYER_SIZE)) {
            goodthings.removeChild(goodthing);
            i--;

            // increase score by 10
            score += 10;
            document.getElementById("score").firstChild.data = score;
        }
    }

    //Level Handling
    var exit = document.getElementById("exitGate");
    var x = parseInt(exit.getAttribute("x"));
    var y = parseInt(exit.getAttribute("y"));

    if (intersect(new Point(560,490), EXIT_SIZE, player.position, PLAYER_SIZE) 
        && document.getElementById("goodthings").childNodes.length == 0) {
        if(!upLevel) {
            passSound.play();
            clearGame();
            upLevel = true;
            score += duration/1000 + level*100;
            level += 1;
            isCheating = false;
            document.getElementById("cheatMode").innerHTML = "Cheat: Off";
            document.getElementById("score").innerHTML = score;
            document.getElementById("level").innerHTML = level;
            load();     
            duration = DURATION;
        }
    }

}


//
// This function display the highscore table
//
function display_highscore() {
    // Get the high score table from cookies
    var highScoreTable = getHighScoreTable();
    // // Create the new score record
    var playerName = prompt("Please enter your name", "");
    if (playerName == "" || playerName == null)
        playerName = "Anonymous"
    var record = new ScoreRecord(playerName, score);

    // // Insert the new score record
    var position = 0;
    while (position < highScoreTable.length) {
        var curPositionScore = highScoreTable[position].score;
        if (curPositionScore < score)
            break;
        position++;
    }
    if (position < 5)
        highScoreTable.splice(position, 0, record);
    // Store the new high score table
    setHighScoreTable(highScoreTable);
    // Show the high score table
    showHighScoreTable(highScoreTable,position);
    score = 0;
    document.getElementById("score").innerHTML = score;
    document.getElementById("Start_Again").style.setProperty("visibility", "visible");
    return;
        //console.log(document.getElementById("Start_Again").style)
}


//
// This function updates the position and motion of the player in the system
//
function gamePlay() {
        // Check collisions
    if (endgame_stat == false && startAgain == false) {
        collisionDetection();
        // Check whether the player is on a platform
        var isOnPlatform = player.isOnPlatform() || player.isOnVerticalPlatform();
    
        // Update player position
        var displacement = new Point();

        // Move left or right
        if (player.motion == motionType.LEFT)
            displacement.x = -MOVE_DISPLACEMENT;
        if (player.motion == motionType.RIGHT)
            displacement.x = MOVE_DISPLACEMENT;
        // Fall
        if (!isOnPlatform && player.verticalSpeed <= 0) {
            displacement.y = -player.verticalSpeed;
            player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        }

        // Jump
        if (player.verticalSpeed > 0) {
            displacement.y = -player.verticalSpeed;
            player.verticalSpeed -= VERTICAL_DISPLACEMENT;
            if (player.verticalSpeed <= 0)
                player.verticalSpeed = 0;
        }

        // Get the new position of the player
        var position = new Point();
        position.x = player.position.x + displacement.x;
        position.y = player.position.y + displacement.y;

        // Check collision with platforms and screen
        player.collidePlatform(position);
        player.collideVerticalPlatform(position);
        player.collideDisappearPlatform(position);
        player.collideScreen(position);

        // Set the location back to the player object (before update the screen)
        player.position = position;

        if (monsterCanShoot && bullMonster_alive) 
            monsterShootBullet();
        moveBullets();
        moveVerticalPlatform();
        //vanishPlatform();
        portalTransmission();
        // Make monsters move
        for (var i = 0; i < num_monster; i++) {
            var node = document.getElementById("monster"+String(i));
            var node_flip = document.getElementById("monster_flip"+String(i));
            if (node != null && node_flip != null) {
                if (done_move_forward[i] == false && done_move_forward_flip[i] == false) {
                    moveMonster(i, starts[i], dests[i], node);
                    moveMonsterFlip(i, starts[i], dests[i], node_flip);
                }
                else {
                    moveMonster(i, dests[i], starts[i], node);
                    moveMonsterFlip(i, dests[i], starts[i], node_flip);
                }
            }
        }
        updateScreen();
    }
}


//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//
function updateScreen() {
    if (upLevel) {
        player.position = new Point(0,0);
        upLevel = false;
    }
    if (startAgain){
        player.position = new Point(0,0);
        startAgain = false;
        endgame_stat = false;
    }
    // Transform the player
    player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
        
    document.getElementById("numBullet").innerHTML = numBullet;
}

var gameChar_worldx_x;
var gameChar_x;   //game character position on x-axis
var gameChar_y;   //game character position on y-axis
var gameChar_width;
var isLeft;       //game charater moving to the left
var isRight;      //game character moving to the right
var isFalling;    //game character jump and fall to the ground
var isPlummeting; //game character fall into the canyon and game over

var floorPos_y;   //ground level
var scrollPos;    //for side scrolling
    
var collectables;
var canyons;
var mountains;
var trees;
var clouds;

var game_score;
var flagpole;
var lives;
var enemies; 
var platforms;

//Sound Effects
var jumpsound;
var collectsound;
var diesound;
var winsound;
var bgm;

function preload() //loading sound from assests folder
{
    //Sounds obtain from https://mixkit.co/
    soundFormats('wav', 'mp3');
    bgmSound = loadSound("assets/bgm.mp3", loaded);
    jumpSound = loadSound("assets/jump.wav");
    collectSound = loadSound("assets/collect.wav");
    dieSound = loadSound("assets/die.wav");
    winSound = loadSound("assets/win.wav");
}

function loaded() //load and loop bgm
{
    bgmSound.loop();
}
function setup()  //inputting values into variables for game setup
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    
    startGame();
}

function startGame() //game setup 
{
    gameChar_x = width/30;
    gameChar_worldx_x = gameChar_x;
	gameChar_y = floorPos_y -100;
    gameChar_width = 40;
    
	enemy_y = floorPos_y;
    
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    
    scrollPos = 0;
    
    collectables =  [{x_pos: 380, y_pos: floorPos_y - 40, size: 50, isFound: false},    //collectable 1
                     {x_pos: 880, y_pos: floorPos_y - 40, size: 50, isFound: false},    //collectable 2
                     {x_pos: 1200, y_pos: floorPos_y - 200, size: 50, isFound: false},  //collectable 3
                     {x_pos: 1400, y_pos: floorPos_y - 30, size: 50, isFound: false}];  //collectable 4
    
    canyons = [{x_pos: 600, width: 100},   //canyon 1
               {x_pos: 80, width: 100},    //canyon 2
               {x_pos: 1020, width: 100}]; //canyon 3
    
    trees = [{pos_x:random(10,width),pos_y:floorPos_y-50},  //tree 1
             {pos_x:random(10,width),pos_y:floorPos_y-50},  //tree 2
             {pos_x:random(10,width),pos_y:floorPos_y-50}]; //tree 3
    
    clouds = [{pos_x:random(10,width),pos_y:random(20,100),size:random(50,80)},   //cloud 1
              {pos_x:random(10,width),pos_y:random(100,200),size:random(50,80)},  //cloud 2
              {pos_x:random(10,width),pos_y:random(200,250),size:random(50,80)}]; //cloud 3
    
    mountains = [{pos_x:random(10,width)},{pos_x:random(50,width)},{pos_x:random(100,width)}]; //mountain 1, mountain 2, mountain 3
    
    enemies =  [];
    enemies.push(new enemy(200, floorPos_y - 10, 360));      //enemy 1
    enemies.push(new enemy(720, floorPos_y - 10, 280));      //enemy 2
    enemies.push(new enemy(1160, floorPos_y - 10, 300));     //enemy 3
    enemies.push(new enemy2(1460, floorPos_y - 10, 300));    //enemy 4
    enemies.push(new enemy3(80, floorPos_y - 130, 1220));    //enemy 5
    enemies.push(new enemy4(1300, floorPos_y - 200, 1200));  //enemy 6
    
    platforms = [];
    platforms.push(createPlatforms(80, floorPos_y - 80, 100));    //platform 1
    platforms.push(createPlatforms(600, floorPos_y - 80, 100));   //platform 2
    platforms.push(createPlatforms(1020, floorPos_y - 80, 100)); // platform 3
    
    game_score = 0;
    flagpole = {isReached: false, x_pos: 1500};
}
function draw()
{
	background(42,82,190); //drawing a blue sky
    
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //drawing a green ground
    
    push();
    translate(scrollPos,0);
    
	drawCanyons();                     //drawing of canyons
    drawClouds();                      //drawing of clouds
    drawMountains();                   //drawing of mountains
    drawTrees();                       //drawing of trees
    drawCollectables();                //drawing of collectables
    collectCollectables();             //function to collect collectables
    checkIfGameCharFallIntoCanyon();   //function to check if character falls into canyon
    renderFlagpole();
    
    for(var i = 0; i < enemies.length; i++)  
        {
            enemies[i].draw(); //drawing of enemy
            
            var isContact = enemies[i].checkContact(gameChar_worldx_x, gameChar_y-50);
            
            if(isContact) // cehck if character is in contact with enemy
                {
                    if(lives > 0)
                        {
                            dieSound.play();
                            lives--;
                            startGame();
                            break;
                        }
                }
        }
    
    for(var i = 0; i < platforms.length; i++)
        {
            platforms[i].draw(); // drawing of platforms
        }
    
    pop();
    
    drawLifeTokens();      //drawing of life token
    drawGameCharacter();   //drawing of character
    charInteractionCode(); //character interation codes
    drawGameScore();       //game score display
    
    if(checkGameOver())    //function to check if game over
        {
            drawGameOver();
            return;
        }
    
}
////////////CHARACTER CODES/////////////
function drawGameCharacter()
{
    if(isLeft && isFalling) //moving left and is falling code
    {
        fill(255,228,196);
        ellipse(gameChar_x,gameChar_y - 50,30,30);

        fill(100,149,237);
        rect(gameChar_x - 10,gameChar_y - 35,20,30);

        fill(0);
        rect(gameChar_x - 15, gameChar_y - 6, 10, 10);
        rect(gameChar_x + 5, gameChar_y - 6, 10, 10);

        fill(0);
        rect(gameChar_x - 5, gameChar_y - 30, 8, 20);

        fill(0);
        ellipse(gameChar_x - 8,gameChar_y - 53,5,5);

        drawGameCharAnchorPoint();
    }

    else if(isRight && isFalling) //moving right and is falling code
    {
        fill(255,228,196);
        ellipse(gameChar_x,gameChar_y - 50,30,30);

        fill(100,149,237);
        rect(gameChar_x - 10,gameChar_y - 35,20,30);

        fill(0);
        rect(gameChar_x - 15, gameChar_y - 6, 10, 10);
        rect(gameChar_x + 5, gameChar_y - 6, 10, 10);

        fill(0);
        rect(gameChar_x - 5, gameChar_y - 30, 8, 20);

        fill(0);
        ellipse(gameChar_x + 8,gameChar_y - 53,5,5);

        drawGameCharAnchorPoint();
    }
    else if(isLeft) //moving left code
    {
        fill(255,228,196);
        ellipse(gameChar_x,gameChar_y - 55,30,30);

        fill(100,149,237);
        rect(gameChar_x - 10,gameChar_y - 40,20,30);

        fill(0);
        rect(gameChar_x - 15, gameChar_y - 11, 10, 10);
        rect(gameChar_x + 5, gameChar_y - 11, 10, 10);

        fill(0);
        rect(gameChar_x - 5, gameChar_y - 35, 8, 20);

        fill(0);
        ellipse(gameChar_x - 8,gameChar_y - 58,5,5);

        drawGameCharAnchorPoint();
    }
    else if(isRight) //moving right code
    {
        fill(255,228,196);
        ellipse(gameChar_x,gameChar_y - 55,30,30);

        fill(100,149,237);
        rect(gameChar_x - 10,gameChar_y - 40,20,30);

        fill(0);
        rect(gameChar_x - 15, gameChar_y - 11, 10, 10);
        rect(gameChar_x + 5, gameChar_y - 11, 10, 10);

        fill(0);
        rect(gameChar_x - 5, gameChar_y - 35, 8, 20);

        fill(0);
        ellipse(gameChar_x + 8,gameChar_y - 58,5,5);

        drawGameCharAnchorPoint();
    }
    else if(isFalling || isPlummeting) //character face forward when falling
    {
        fill(255,228,196);
        ellipse(gameChar_x,gameChar_y - 50,30,30);

        fill(100,149,237);
        rect(gameChar_x - 13,gameChar_y - 35,26,30);

        fill(0);
        rect(gameChar_x - 15, gameChar_y - 6, 10, 10);
        rect(gameChar_x + 5, gameChar_y - 6, 10, 10);

        fill(0);
        rect(gameChar_x - 21, gameChar_y - 30, 8, 20);
        rect(gameChar_x + 13, gameChar_y - 30, 8, 20);

        fill(0);
        ellipse(gameChar_x - 5,gameChar_y - 53,5,5);
        ellipse(gameChar_x + 5,gameChar_y - 53,5,5);

        fill(0);
    ellipse(gameChar_x,gameChar_y,5,5);
    }
    else //facing forward code
    {
        fill(255,228,196);
        ellipse(gameChar_x,gameChar_y - 55,30,30);

        fill(100,149,237);
        rect(gameChar_x - 13,gameChar_y - 40,26,30);

        fill(0);
        rect(gameChar_x - 15, gameChar_y - 11, 10, 10);
        rect(gameChar_x + 5, gameChar_y - 11, 10, 10);

        fill(0);
        rect(gameChar_x - 21, gameChar_y - 35, 8, 20);
        rect(gameChar_x + 13, gameChar_y - 35, 8, 20);

        fill(0);
        ellipse(gameChar_x - 5,gameChar_y - 58,5,5);
        ellipse(gameChar_x + 5,gameChar_y - 58,5,5);

        drawGameCharAnchorPoint();
    }
}

function charInteractionCode()
{
	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here
    if (isPlummeting)
    {
        gameChar_y += 10;
        dieSound.play();
        startGame();
        return; //skip the code below
    }

    if (isLeft == true)
    {
        if(gameChar_x > width * 0.2)
        {
        gameChar_x -= 5;
        }
        
        else
        {
        scrollPos += 5;
        }
    }
    else if (isRight == true)
    {
        if(gameChar_x < width * 0.8)
        {
        gameChar_x += 5;
        }
        
        else
        {
        scrollPos -= 5;
        }
    }
    
    //check if game char is floating in the air
    if (gameChar_y < floorPos_y)
    {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
            {
                if(platforms[i].checkContact(gameChar_worldx_x, gameChar_y) == true)
                {
                    isContact = true;
                    break;
                }
            }
        if(isContact == false)
            {
            gameChar_y += 2;
            isFalling = true;
            }
    }
    else
    {
        isFalling = false;
    }
    
    if(flagpole.isReached == false)
        {
            checkFlagpole();
        }
    
    gameChar_worldx_x = gameChar_x - scrollPos;
}
    
function drawGameCharAnchorPoint() //game character anchor point
{
    fill(0);
    ellipse(gameChar_x,gameChar_y - 5,5,5);
}

function keyPressed()
{
	// 

	//open up the console to see how these work
	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);
    
    if (keyCode == 37)
    {
        isLeft = true;
    }
    else if (keyCode == 39)
    {
        isRight = true;
    }
    else if (keyCode == 38)
    {
        gameChar_y -= 100;
        jumpSound.play();
    }
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
    
    if (keyCode == 37)
    {
        isLeft = false;
    }
    else if (keyCode == 39)
    {
        isRight = false;
    }
}

function drawClouds()
{
   for(var i = 0; i < clouds.length; i++)
    {
        fill(255);
        //anchor point
        ellipse(clouds[i].pos_x,clouds[i].pos_y,clouds[i].size*1.2,clouds[i].size*1.2);
        ellipse(clouds[i].pos_x-40,clouds[i].pos_y,clouds[i].size,clouds[i].size);
        ellipse(clouds[i].pos_x+40,clouds[i].pos_y,clouds[i].size,clouds[i].size);
        //anchor point
        fill(255,0,0);
        ellipse(clouds[i].pos_x,clouds[i].pos_y,10,10);
        
        clouds[i].pos_x = clouds[i].pos_x + 1;
    }  
}

function drawMountains()
{
        for(var i = 0; i < mountains.length; i++)
    {  
        fill(139,69,19);
        triangle(mountains[i].pos_x,floorPos_y,mountains[i].pos_x + 400,floorPos_y,mountains[i].pos_x + 200,floorPos_y - 280);
        //summit of mountain
        fill(205,133,63,80)
        triangle(mountains[i].pos_x + 142,floorPos_y - 200,mountains[i].pos_x + 257,floorPos_y - 200,mountains[i].pos_x + 200,floorPos_y - 280);

        fill(255,0,0);
        ellipse(mountains[i].pos_x, mountains[i].pos_y ,10,10);
    }
}

function drawTrees()
{
        for(var i = 0; i < trees.length; i++)
    {
        noStroke();
        //tree trunk
        fill(120,100,40);
        rectMode(CENTER);
        //leave at least one tree point without
        //adding of substracting values from.
        rect(trees[i].pos_x, trees[i].pos_y,40,100);
        rectMode(CORNER);//setback to default mode
        //tree leaves
        fill(0,155,0);
        fill(46,139,87);
        rect(trees[i].pos_x-60,trees[i].pos_y-80,120,30);
        rect(trees[i].pos_x-50,trees[i].pos_y-110,100,30);
        rect(trees[i].pos_x-40,trees[i].pos_y-140,80,30);
        rect(trees[i].pos_x-30,trees[i].pos_y-170,60,30);
        //anchor point
        fill(255,0,0);
        ellipse(trees[i].pos_x, trees[i].pos_y,10,10);
    }
}

function drawCollectables()
{
    for(var i = 0; i < collectables.length; i++)
    {
        if(collectables[i].isFound == false)
            {
                fill(255,215,0);
                rectMode(CENTER);
                ellipse(collectables[i].x_pos, collectables[i].y_pos, collectables[i].size, collectables[i].size);
                fill(255,255,224);
                ellipse(collectables[i].x_pos, collectables[i].y_pos, collectables[i].size - 15, collectables[i].size - 15);
                rectMode(CORNER);
                fill(55,0,0);
                ellipse(collectables[i].x_pos, collectables[i].y_pos); 
                ellipse(collectables[i].x_pos, collectables[i].y_pos); 
            }
    }
}

function collectCollectables()
{
    for(i = 0; i < collectables.length; i++)
    {
        if(collectables[i].isFound == false)
            {
                var d = dist(gameChar_worldx_x, gameChar_y, collectables[i].x_pos, collectables[i].y_pos);
                    
                if (d < collectables[i].size)
                    {
                        collectables[i].isFound = true;  
                        collectSound.play();
                        game_score ++;
                    } 
            }
    }
}

function drawGameScore()
{
    fill(255);
    noStroke();
    textSize(20)
    text("score: " + game_score, 20, 20);
}

function drawCanyons()
{
    for(var i = 0; i < canyons.length; i++)
    {
        fill(135,206,235);
        //rectMode(CENTER);
        rect(canyons[i].x_pos, floorPos_y, canyons[i].width, height - floorPos_y);
        //rectMode(CORNER);
        fill(255,0,0);
        ellipse(canyons[i].x_pos,floorPos_y,10,10);
    }
}

function checkIfGameCharFallIntoCanyon()
{
    for(var i = 0; i < canyons.length; i ++)
        {
            //check if game char is on the floor
            var cond1 = gameChar_y == floorPos_y; //boolean
            //check if game char is on the left of the canyon
            var cond2 = gameChar_worldx_x - gameChar_width/2 > (canyons[i].x_pos);
            //check if game char is from the right of the canyon
            var cond3 = gameChar_worldx_x + gameChar_width/2 < (canyons[i].x_pos + canyons[i].width);

            if (cond1 && cond2 && cond3)
            { 
                isPlummeting = true;
                lives--;
            }
        }
}
    
function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    fill(255,0,255);
    noStroke();
    if(flagpole.isReached)
        {
            rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
        }
    else
        {
            rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
        }
    
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_worldx_x - flagpole.x_pos);
    
    if(d < 5 && game_score == 4)
        {
            flagpole.isReached = true;
            winSound.play();
        }
    else if(d < 10 && game_score < 4)
        {   
            fill(255,255,255)
            rect(170,255,600, 40)
            fill(0);
            textSize(30);
            text("please collect all coins to win the game!", 200, height/2);
        }

}

function drawLifeTokens()
{
    fill(0);
    for(var i = 0; i < lives; i++)
        {
            rect(40 * i + 900, 10, 30, 30);
        }
}

function checkPlayerDie()
{
    if(gameChar_y > height)
        {
            if(lives < 0)
                {
                    startGame();
                }
        }
}

function checkGameOver()
{
    var gameOver = false;
    
    if(lives < 1 || flagpole.isReached)
        {
            gameOver = true;
        }
    return gameOver;
}

let button;
function drawGameOver()
{
    fill(0);
    textSize(100);
    text("Game Over!", 250, height/2 - 100);
    
    if(lives > 0)
        {
            text("You Win!", 300, height/2);
            window.alert("Press OK to restart!");
            setup();
        }

    else
        {
            text("You Lose!", 300, height/2);
            window.alert("Press OK to restart!");
            setup();
        }
}

///////////////////////////Drawing of enemies/////////////////////////////
function enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 2;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -2;
            }
        else if(this.currentX < this.x)
            {
                this.inc = 2;
            }
    }
    
    this.draw = function()
    {
        this.update();
        //fill(255, 0, 0);
        //ellipse(this.currentX, this.y, 20, 20);
        if(this.inc > 0 )
            {        
                fill(255,228,196);
                ellipse(this.currentX, this.y - 45,30,30);

                fill(255, 0, 0);
                rect(this.currentX - 10,this.y - 30,20,30);

                fill(0);
                rect(this.currentX - 15, this.y, 10, 10);
                rect(this.currentX + 5, this.y, 10, 10);

                fill(0);
                rect(this.currentX - 5, this.y - 25, 8, 20);

                fill(0);
                ellipse(this.currentX + 8, this.y - 48,5,5);
            }
        
        else 
            {
                fill(255,228,196);
                ellipse(this.currentX,this.y - 45,30,30);

                fill(255, 0, 0);
                rect(this.currentX - 10,this.y - 30,20,30);

                fill(0);
                rect(this.currentX - 15, this.y , 10, 10);
                rect(this.currentX + 5, this.y , 10, 10);

                fill(0);
                rect(this.currentX - 5, this.y - 25, 8, 20);

                fill(0);
                ellipse(this.currentX - 8,this.y - 48,5,5);
            }

    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y - 30)
        
        if(d < 40)
            {
                return true;
            }
        return false;
    }
}

function enemy2(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = -2;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x)
            {
                this.inc = -2;
            }
        else if(this.currentX < this.x - this.range)
            {
                this.inc = 2;
            }
    }
    
    this.draw = function()
    {
        this.update();
        //fill(255, 0, 0);
        //ellipse(this.currentX, this.y, 20, 20);
        if(this.inc > 0 )
            {        
                fill(255,228,196);
                ellipse(this.currentX, this.y - 45,30,30);

                fill(255, 0, 0);
                rect(this.currentX - 10,this.y - 30,20,30);

                fill(0);
                rect(this.currentX - 15, this.y, 10, 10);
                rect(this.currentX + 5, this.y, 10, 10);

                fill(0);
                rect(this.currentX - 5, this.y - 25, 8, 20);

                fill(0);
                ellipse(this.currentX + 8, this.y - 48,5,5);
            }
        
        else 
            {
                fill(255,228,196);
                ellipse(this.currentX,this.y - 45,30,30);

                fill(255, 0, 0);
                rect(this.currentX - 10,this.y - 30,20,30);

                fill(0);
                rect(this.currentX - 15, this.y , 10, 10);
                rect(this.currentX + 5, this.y , 10, 10);

                fill(0);
                rect(this.currentX - 5, this.y - 25, 8, 20);

                fill(0);
                ellipse(this.currentX - 8,this.y - 48,5,5);
            }

    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y - 30)
        
        if(d < 40)
            {
                return true;
            }
        return false;
    }
}

function enemy3(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 3;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -3;
            }
        else if(this.currentX < this.x)
            {
                this.inc = 3;
            }
    }
    
    this.draw = function()
    {
        this.update();
        fill(246,190,0);
        rect(this.currentX, this.y, 100, 5);


    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)
        var z = dist(gc_x, gc_y, this.currentX + 100, this.y)
        
        if(d < 40 || z < 40)
            {
                return true;
            }
        return false;
    }
}

function enemy4(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = -3;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x)
            {
                this.inc = -3;
            }
        else if(this.currentX < this.x - this.range)
            {
                this.inc = 3;
            }
    }
    
    this.draw = function()
    {
        this.update();
        fill(246,190,0);
        rect(this.currentX, this.y, 100, 5);

    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)
        var z = dist(gc_x, gc_y, this.currentX + 100, this.y)
        
        if(d < 40 || z < 40)
            {
                return true;
            }
        return false;
    }
}
//////////////////////////////////////////////////////////////////////

function createPlatforms(x, y, length) //creating platforms and check if character is touching platform
{
    var p = {x: x, 
             y: y, 
             length: length, 
             draw: function()
                {
                    fill(92, 64, 51);
                    rect(this.x, this.y, this.length, 20);
                },
             checkContact: function(gc_x, gc_y)
                {
                    if(gc_x > this.x && gc_x < this.x + this.length)
                    {
                        var d = this.y - gc_y;
                        if(d >= 0 && d < 5)
                            {
                                return true;
                            }
                    }
                    return false;
                }
            }
    return p;
}

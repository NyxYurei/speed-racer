class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    
    this.leaderboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
  }

  getState(){
    var gameStateRef = database.ref ("gameState");
    gameStateRef.on ("value", function(data){
     gameState = data.val();
    });
  }

  update(state){
    database.ref ("/").update({
      gameState: state
    });
  }
  
  start() {
    
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite (width/2 -50, height -100);
    car1.addImage ("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite (width/2 +100, height -100)
    car2.addImage ("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1,car2];

    fuel = new Group();
    coins = new Group();
    this.addSprites(fuel, 4, fuelImg, 0.02);
    this.addSprites(coins, 10, coinsImg, 0.09);
  }

   handleElements(){
     form.hide();
     form.titleImg.position(40, 50);
     form.titleImg.class("gameTitleAfterEffects");
      
      this.resetTitle.html("restart the game?");
      this.resetTitle.class("resetText");
      this.resetTitle.position(width/2 + 200, 40);

      this.resetButton.class("resetButton");
      this.resetButton.position(width/2 + 230, 90);

      this.leaderboardTitle.html("leaderboard");
      this.leaderboardTitle.class("resetText");
      this.leaderboardTitle.position(width/3 - 60, 40);
    
      this.leader1.class("leadersText");
      this.leader1.position(width/3 - 50, 80);
      
      this.leader2.class("leadersText");
      this.leader2.position(width/3 - 50, 120);

    }

   play(){

    this.handleElements();
    this.handleResetButton();
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    if(allPlayers != undefined){
      image(track, 0, -height*5, width, height*6);
       this.showLeaderboard();
       this.showLife();
       this.showFuelBar();

       var index = 0;
       for(var plr in allPlayers){
        index++;
        
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index-1].position.x = x;
        cars[index-1].position.y = y;

        if(index == player.index){
          stroke(10);
          fill("red");
          ellipse(x, y, 60);
          this.handleFuel(index);
          this.handleCoins(index);
          camera.position.x = cars[index-1].position.x;
          camera.position.y = cars[index-1].position.y;
        }
      }
      this.handlePlayerControls();

      const finishLine = height* 6 - 100;

      drawSprites();
    }
   } 
   
   showFuelBar() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 100, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 100, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 100, player.fuel, 20);
    noStroke();
    pop();
   }
   addSprites(spriteGroup, number, spriteImage, scale){
    for(var i = 0; i < number; i++){
      var x, y;
      x = random(width/2 + 150, width/2 - 150);
      y = random(-height * 4.5, height - 400);
  
      var sprite = createSprite(x,y);
      sprite.addImage("sprite", spriteImage);
  
      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
   }

   handleFuel(index){
     cars[index-1].overlap(fuel, function(collector, collected){
      player.fuel = 185;
      collected.remove();
    });

    if (player.fuel > 0 && this.playerMoving){
      player.fuel -= 0.3;
    }
   
    if (player.fuel <= 0){
      gameState = 2;
      this.gameOver();
    }
    
  /*if (this.playerMoving) {
    player.positionY += 5;
    player.update():
  }*/

  }

   handleCoins(index){
    cars[index-1].overlap(coins, function(collector, collected){
      player.score += 21;
      player.update();
      collected.remove();
    })
  }
  
   handleResetButton(){
     this.resetButton.mousePressed(() => {
      database.ref("/").set({
        carsAtEnd: 0,
        playerCount: 0,
        gameState: 0,
        players: {}
        });
       
       window.location.reload();
    })
     }

      showLife() {
        push();
        image(lifeImage, width / 2 - 130, height - player. positionY - 400, 20, 20);     
        fill("white");
        rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
        fill("#f50057");
        rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
        noStroke();
        pop();
      }


     showLeaderboard() {
      var leader1, leader2;
      var players = Object.values(allPlayers);
      if (
        (players[0].rank === 0 && players[1].rank === 0) ||
        players[0].rank === 1
      ) {
        // &emsp;    Esta tag é usada para exibir quatro espaços.
        leader1 =
          players[0].rank +
          "&emsp;" +
          players[0].name +
          "&emsp;" +
          players[0].score;
    
        leader2 =
          players[1].rank +
          "&emsp;" +
          players[1].name +
          "&emsp;" +
          players[1].score;
      }
    
      if (players[1].rank === 1) {
        leader1 =
          players[1].rank +
          "&emsp;" +
          players[1].name +
          "&emsp;" +
          players[1].score;
    
        leader2 =
          players[0].rank +
          "&emsp;" +
          players[0].name +
          "&emsp;" +
          players[0].score;
      }
    
      this.leader1.html(leader1);
      this.leader2.html(leader2);
    }

     handlePlayerControls(){
      if(keyIsDown(UP_ARROW)){
        this.playerMoving = true;
        player.positionY += 10;
        player.update()
      }
      if(keyIsDown(LEFT_ARROW)){
        player.positionX -= 10;
       player.update()
     }
     if(keyIsDown(RIGHT_ARROW)){
      player.positionX += 10;
       player.update()
   }

  }
   gameOver() {
     this.showLeaderboard({
       title: 'End of the game!',
       text: 'you lost the game',
       imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
       imageSize: "100x100",
       confirmButtonText: "thank you for playing"
     })
   }
}


class Form {
  constructor() {
   this.input = createInput("").attribute("placeholder", "enter your name");
   this.playButton = createButton("play");
   this.titleImg = createImg("./assets/title.png", "Speed Racer");
   this. greeting = createElement("h2");
  }

  setElementPosition() {
    this.input.position(width/2 - 110, height/2 -80);
    this.playButton.position(width/2 - 90, height/2 - 20);
    this.titleImg.position(width/ - 160,  100);
    this.greeting.position(width/2 - 300, height/2 - 100);
  }


  hide() {
   this.input.hide();
   this.playButton.hide();
   this.greeting.hide();
  }

  handleMousePressed() {
   this.playButton.mousePressed(() => { 
      this.input.hide();
      this.playButton.hide();
      var m = `hello, ${this.input.value()} </br>
      wait for other players.`
      this.greeting.html(m);
      player.name = this.input.value();
     //aumente o playerCount e atualize o novo valor
       playerCount = playerCount +1;
       player.updateCount(playerCount);
       player.index = playerCount;
       player.addPlayer();
       player.updateCount(playerCount);
       player.getDistance();
    });
  }

  display() {
   this.setElementPosition(); 
   //this.setElementStyle();
   this.handleMousePressed();
  }
}

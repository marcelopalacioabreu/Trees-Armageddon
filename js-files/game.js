/* 
  Game Ideas:

  Each team will make one shoot at a time
      - if more than one character per team, make them shoot one at a time.
  Team that reaches zero health first will loose

  User interactions per turn,
    - move worm -> set coordinates
    - sets direction -> left/right values
    - set shooting position -> up/down arrows
    - shoot
    
  Game calculations after user shoots gun,
    - set shoot trajectory
    - check shoot collision on each movement, until it is out of the canvas or collides with ground or any char
    - make shoot explode
    - calculate life for each char
    - update each char life
    - remove dead char
    - update board scores
    - check if any team has zero char left
    - assign winning team
    
    

*/
class Game {
  constructor($canvas) {
    this.$canvas = $canvas;
    this.context = $canvas.getContext('2d');

    this.width = $canvas.width;
    this.height = $canvas.height;

    // this.team1 = [];
    // this.team2 = [];

    this.eventRuns = false;

    this.characterTurn = 0;
  }

  createsTeam(teamName, teamSize, orientation) {
    const orient = orientation;

    for (let i = 0; i < teamSize; i++) {
      const char = new Character(this, orient, 50 + i * 70);
      const gunVars = char.extractVarsFromChar();
      const gun = new Gun(this, ...gunVars);
      const projectileVars = gun.extractVarsFromGun();
      const proj = new Projectile(this, ...projectileVars);

      teamName.push({ char, gun, proj });
    }
    teamName.push(orient);
  }

  drawTeam(team) {
    for (let teamchar of team) {
      for (let element in teamchar) {
        switch (element) {
          case 'char':
            teamchar[element].draw();
          case 'gun':
            teamchar[element].draw();
        }
      }
    }
  }

  gameLogic() {
    let tempTurn = this.characterTurn;
    console.log('inside gamelogic - characterturn', this.characterTurn);
    console.log('inside gamelogic - tempturn', tempTurn);
    switch (this.characterTurn % 6) {
      case 0: // Team 1 - 0
        this.characterPlays(this.team1, 0, true);
        break;
      case 1: // Team 2 - 0
        this.characterPlays(this.team2, 0, true);
        break;
      case 2: // Team 1 - 1
        this.characterPlays(this.team1, 1, true);
        break;
      case 3: // Team 2 - 1
        this.characterPlays(this.team2, 1, true);
        break;
      case 4: // Team 1 - 2
        this.characterPlays(this.team1, 2, true);
        break;
      case 5: // Team 2 - 2
        this.characterPlays(this.team2, 2, true);
        break;
    }

    /* if (tempTurn < this.characterTurn && this.characterTurn <= 6) {
      setTimeout(() => {
        console.log('inside settimeout - tempturn', tempTurn);
        this.gameLogic();
      }, 1000);
    } */
  }
  /*	
  loop(timestamp) {
    this.gameLogic();
    window.requestAnimationFrame((timestamp) => this.loop(timestamp));
  }
  */

  start() {
    this.reset();
    this.gameLogic();
    //this.loop();
    //this.characterPlays(this.team2, 1);
  }

  reset() {
    this.ground = new Ground(this);
    this.ground.draw();

    this.team1 = [];
    this.team2 = [];

    this.createsTeam(this.team1, 3, 'right');
    this.drawTeam(this.team1);

    this.createsTeam(this.team2, 3, 'left');
    this.drawTeam(this.team2);
  }

  clearEverything() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  drawCurrentStatus() {
    this.ground.draw();
    this.drawTeam(this.team1);
    this.drawTeam(this.team2);
  }

  characterPlays(teamName, charNumber, run) {
    // teamName[charNumber][className].method
    // teamName - array with team chars
    // charNumber - specific char that is being refered
    // className - {char,gun,proj} - that represents each class specifications.
    let runFunction = run;
    this.charInMotion = true;
    let updateValues;
    console.log('characterPlays', teamName);
    window.addEventListener('keydown', (event) => {
      // event.preventDefault();
      if (runFunction) {
        const keyCode = event.keyCode;
        switch (keyCode) {
          case 37: // Left
            teamName[charNumber]['char'].move('left');
            updateValues = teamName[charNumber]['char'].extractVarsFromChar();
            teamName[charNumber]['gun'] = new Gun(this, ...updateValues);
            this.clearEverything();
            this.drawCurrentStatus();
            break;
          case 39: // Right
            teamName[charNumber]['char'].move('right');
            updateValues = teamName[charNumber]['char'].extractVarsFromChar();
            teamName[charNumber]['gun'] = new Gun(this, ...updateValues);
            this.clearEverything();
            this.drawCurrentStatus();
            break;
          case 38: // Up
            teamName[charNumber]['gun'].pointsTo('up');

            this.clearEverything();
            this.drawCurrentStatus();
            break;
          case 40: // Down
            teamName[charNumber]['gun'].pointsTo('down');

            this.clearEverything();
            this.drawCurrentStatus();
            break;
          case 32: // Space Bar
            this.clearEverything();
            this.drawCurrentStatus();
            updateValues = teamName[charNumber]['gun'].extractVarsFromGun();
            teamName[charNumber]['proj'] = new Projectile(this, ...updateValues);

            teamName[charNumber]['proj'].shootsInMotion();
            runFunction = false;
        }
      }
    });
  }

  // Previous logic, working
  /* characterMoves() {
    window.addEventListener('keydown', (event) => {
      // event.preventDefault();
      const keyCode = event.keyCode;
      switch (keyCode) {
        case 37: // Left
          this.character.move('left');
          this.clearEverything();
          this.drawCurrentStatus();
          break;
        case 39: // Right
          this.character.move('right');
          this.clearEverything();
          this.drawCurrentStatus();
          break;
        case 38: // Up
          this.gun.pointsTo('up');
          this.clearEverything();
          this.drawCurrentStatus();
          break;
        case 40: // Down
          this.gun.pointsTo('down');
          this.clearEverything();
          this.drawCurrentStatus();
          break;
        case 32: // Space Bar
          this.clearEverything();
          this.drawCurrentStatus();
          this.projectile.shootsInMotion();
      }
    });
  } */
}

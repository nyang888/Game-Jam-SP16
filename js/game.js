var snake, apple, squareSize, score, cursors, scoreTextValue, textStyle_Key, textStyle_Value, timer, timerTextValue, clock;

var Game = {

  preload: function() {
    // Here we load all the needed resources for the level.
    // In our case, that's just two squares - one for the snake body and one for the apple.
    game.load.image('snake', 'assets/snake.png');
    game.load.image('apple', 'assets/apple.png');
  },

  create: function() {

    // By setting up global variables in the create function, we initialise them on game start.
    // We need them to be globally available so that the update function can alter them.

    snake = {}; // This will work as a stack, containing the parts of our snake
    apple = {}; // An object for the apple;
    squareSize = 15; // The length of a side of the squares. Our image is 15x15 pixels.
    score = 0; // Game score.
    timer = 120;

    // Set up a Phaser controller for keyboard input.
    cursors = game.input.keyboard.createCursorKeys();

    game.stage.backgroundColor = '#061f27';

    // Generate the initial snake stack. Our snake will be 10 elements long.
    snake = game.add.sprite(150, 150, 'snake'); // Parameters are (X coordinate, Y coordinate, image)
    game.physics.arcade.enable(snake);

    // Genereate the first apple.
    this.generateApple();

    // Add Text to top of game.
    textStyle_Key = {
      font: "bold 14px sans-serif",
      fill: "#46c0f9",
      align: "center"
    };
    textStyle_Value = {
      font: "bold 18px sans-serif",
      fill: "#fff",
      align: "center"
    };

    // Score.
    game.add.text(30, 20, "SCORE", textStyle_Key);
    game.add.text(30, 40, "REMAINING TIME", textStyle_Key);
    scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
    timerTextValue = game.add.text(160, 38, timer.toString(), textStyle_Value);

    // Set up timer
    clock = game.time.create(false);
    clock.loop(Phaser.Timer.SECOND, this.updateTimer, this);
    clock.start();

  },

  update: function() {
    if (cursors.right.isDown) {
      snake.body.velocity.x = 150;
    } else if (cursors.left.isDown) {
      snake.body.velocity.x = -150;
    } else if (cursors.up.isDown) {
      snake.body.velocity.y = -150;
    } else if (cursors.down.isDown) {
      snake.body.velocity.y = 150;
    }

    if (!cursors.right.isDown && !cursors.left.isDown) {
      snake.body.velocity.x = 0;
    }

    if (!cursors.up.isDown && !cursors.down.isDown) {
      snake.body.velocity.y = 0;
    }

    // Check for apple collision.
    this.appleCollision();

    // Check with collision with wall. Parameter is the head of the snake.
    this.wallCollision();

  },

  updateTimer: function() {
    timer -= 1;
    timerTextValue.text = timer.toString();
    if (timer == 0) {
      end();
    }
  },

  generateApple: function() {

    // Chose a random place on the grid.
    // X is between 0 and 585 (39*15)
    // Y is between 0 and 435 (29*15)

    var randomX = Math.floor(Math.random() * 40) * squareSize,
      randomY = Math.floor(Math.random() * 30) * squareSize;

    // Add a new apple.
    apple = game.add.sprite(randomX, randomY, 'apple');
  },

  appleCollision: function() {

    // Check if any part of the snake is overlapping the apple.
    // This is needed if the apple spawns inside of the snake.
    if (Math.abs(snake.x - apple.x) < 16 && Math.abs(snake.y - apple.y) < 16) {

      // Destroy the old apple.
      apple.destroy();

      // Make a new one.
      this.generateApple();

      // Increase score.
      score++;

      // Refresh scoreboard.
      scoreTextValue.text = score.toString();

    }

  },

  wallCollision: function() {

    // Check if the head of the snake is in the boundaries of the game field.

    if (snake.x > 590) {
      snake.x = 580;
      snake.body.velocity.x = 0;
    } else if (snake.x < 10) {
      snake.x = 20;
      snake.body.velocity.x = 0;
    }

    if (snake.y > 440) {
      snake.y = 430;
      snake.body.velocity.y = 0;
    } else if (snake.y < 10) {
      snake.y = 20;
      snake.body.velocity.y = 0;
    }

  }

};

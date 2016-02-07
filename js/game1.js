var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

game.time;

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('food', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var platforms = game.add.group();
var player;
var cursors;
var foods;
var score = 15; // Init to an integer
var scoreText;
var timerText;
var timer = 120;

function create() {
  score = 0; // Restart counting score
  timer = 120;

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'sky');

  // Set up ground
  platforms = game.add.group();
  platforms.enableBody = true;
  var ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(2, 2);
  ground.body.immovable = true;

  // Set up main player
  player = game.add.sprite(32, game.world.height - 150, 'dude');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);
  cursors = game.input.keyboard.createCursorKeys();

  // Initiate foodstuffs
  foods = game.add.group();
  foods.enableBody = true;

  game.time.events.loop(Phaser.Timer.SECOND, updateTimer);

  scoreText = game.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000'
  });
  timerText = game.add.text(16, 64, 'remaining time: 120', {
    fontSize: '32px',
    fill: '#000'
  });
}

function update() {
  if (Math.random() * 100 > 98) {
    var food = foods.create(Math.random() * 800, 0, 'food');
    food.body.gravity.y = 100;
  }

  //  Collide the player and the foods with the platforms
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(foods, platforms);
  game.physics.arcade.overlap(player, foods, collectFood, null, this);

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    //  Move to the left
    player.body.velocity.x = -150;

    player.animations.play('left');
  } else if (cursors.right.isDown) {
    //  Move to the right
    player.body.velocity.x = 150;

    player.animations.play('right');
  } else {
    //  Stand still
    player.animations.stop();

    player.frame = 4;
  }

  //  Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -350;
  }
}

function updateTimer() {
  timer -= 1;
  timerText.text = 'remaining time: ' + timer;
  if (timer == 0) {
    end();
  }
}

function collectFood(player, food) {
  ++score;
  scoreText.text = 'Score: ' + score;
  food.kill();
}

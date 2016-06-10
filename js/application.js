var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

  // game.load.image('sky', 'assets/sky.png');
  game.load.image('starfield', 'assets/starfield.jpg');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('bullet2', 'assets/enemy-bullet.png');
  game.load.image('ground', 'assets/platform.jpg');
  // game.load.image('star', 'assets/diamond.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('star', 'assets/chick.png', 18, 18);
  game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128, 10);
  game.load.spritesheet('ironman', 'assets/ironman.png', 32, 48, 16);
  game.load.spritesheet('captainamerica', 'assets/captainamerica_shield.png', 32, 48, 16);

}

var player;
var platforms;
var cursors;
var bulletTime = 0;
var bulletTime2 = 0;

var stars;
var score = 0;
var score2 = 0;
var scoreText;
var scoreText2;

var bullets;
var bullets2;

var upW;
var downS;
var leftA;
var rightD;
var explosions;

function create() {

  // Explosions connected to
  game.add.tileSprite(0, 0, 1000,800,'starfield');
  explosions = game.add.group();
  explosions.createMultiple(30, 'kaboom');
  explosions.forEach(function(explosion) {

    explosion.animations.add('kaboom');
  }, this)
  //star.animations.add('kaboom', [0,1,2,3,4,5,6], 10, true);



  //  Our bullet group
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet');
  bullets.setAll('anchor.x', 0.0);
  bullets.setAll('anchor.y', 0.0);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  bullets2 = game.add.group();
  bullets2.enableBody = true;
  bullets2.physicsBodyType = Phaser.Physics.ARCADE;
  bullets2.createMultiple(30, 'bullet2');
  bullets2.setAll('anchor.x', 0.0);
  bullets2.setAll('anchor.y', 0.0);
  bullets2.setAll('outOfBoundsKill', true);
  bullets2.setAll('checkWorldBounds', true);

  game.physics.startSystem(Phaser.Physics.ARCADE);
  //game.stage.backgroundColor = "#4488AA";

  //game.add.sprite(0, 0, 'sky');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  //  We will enable physics for any object that is created in this group
  platforms.enableBody = true;

  // Here we create the ground.
  var ground = platforms.create(0, game.world.height - 64, 'ground');

  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(4, 4);


  //  This stops it from falling away when you jump on it
  ground.body.immovable = true;

  //  Now let's create two ledges
  // var ledge = platforms.create(400, 600, 'ground');
  // ledge.body.immovable = true;

  // ledge = platforms.create(-200, 250, 'ground');
  // ledge.body.immovable = true;

  // ledge = platforms.create(500, 200, 'ground');
  // ledge.body.immovable = true;

  // ledge = platforms.create(150, 400, 'ground');
  // ledge.body.immovable = true;

  // The player and its settings
  player = game.add.sprite(768, game.world.height - 150, 'ironman');
  player2 = game.add.sprite(100, game.world.height - 150, 'captainamerica');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);
  game.physics.arcade.enable(player2);

  //  Player physics properties. Give the little guy a slight bounce.
  player.anchor.setTo(0.5, 0.5);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  player2.body.bounce.y = 0.2;
  player2.body.gravity.y = 300;
  player2.body.collideWorldBounds = true;
  //  Our two animations, walking left and right.
  player.animations.add('left', [4, 5, 6, 7], 10, true);
  player.animations.add('right', [8, 9, 10, 11], 10, true);
  player2.animations.add('left', [4, 5, 6, 7], 10, true);
  player2.animations.add('right', [8, 9, 10, 11], 10, true);

  //  Finally some stars to collect
  stars = game.add.group();

  //  We will enable physics for any star that is created in this group
  stars.enableBody = true;

  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 99; i++)
  {
    //  Create a star inside of the 'stars' group
    var star = stars.create(i * 10, 600 * Math.random(), 'star');
    star.animations.add('kaboom', [0,1,2,3,4,5,6], 10, true);

    //  Let gravity do its thing
    star.body.gravity.y = 5 * Math.random();

    //  This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.8 + Math.random() * 0.2;
    star.body.bounce.x = 0.8 + Math.random() * 0.2;

    star.body.collideWorldBounds = true;
  }

  //  The score
  scoreText = game.add.text(16, 16, 'player1 score: 0', { fontSize: '20px', fill: '#FFF' });
  scoreText2 = game.add.text(16, 40, 'player2 score: 0', { fontSize: '20px', fill: '#FFF' });

  //  Our controls.
  cursors = game.input.keyboard.createCursorKeys();

}

function update() {

  //  Collide the player and the stars with the platforms
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(player2, platforms);
  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.collide(player, player2);
  game.physics.arcade.collide(player, stars);
  game.physics.arcade.collide(player2, stars);
  game.physics.arcade.collide(stars, stars);





  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  // game.physics.arcade.overlap(player, stars, collectStar, null, this);
  // game.physics.arcade.overlap(player2, stars, collectStar, null, this);
  game.physics.arcade.overlap(bullets, stars, collisionHandler, null, this);
  game.physics.arcade.overlap(bullets2, stars, collisionHandler, null, this);
  game.physics.arcade.overlap(bullets2, player, playercollisionHandler, null, this);
  game.physics.arcade.overlap(bullets, player2, playercollisionHandler, null, this);



  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;
  player2.body.velocity.x = 0;

  var fireButton = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
  var fireButton2 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  upW = game.input.keyboard.addKey(Phaser.Keyboard.W);
  downS = game.input.keyboard.addKey(Phaser.Keyboard.S);
  leftA = game.input.keyboard.addKey(Phaser.Keyboard.A);
  rightD = game.input.keyboard.addKey(Phaser.Keyboard.D);

  if (fireButton.isDown)
  {
    fireBullet();
  }

  if (fireButton2.isDown)
  {
    fireBullet2();
  }

  if (leftA.isDown && upW.isDown && player2.body.touching.down)
  {
    player2.body.velocity.x = -150;
    player2.body.velocity.y = -350;
    player2.animations.play('left');
  }
  else if (rightD.isDown && upW.isDown && player2.body.touching.down)
  {
    player2.body.velocity.x = 150;
    player2.body.velocity.y = -350;
    player2.animations.play('right');
  }
  else if (leftA.isDown)
  {
    player2.body.velocity.x = -150;
    player2.animations.play('left');
  }
  else if (rightD.isDown)
  {
    player2.body.velocity.x = 150;
    player2.animations.play('right');
  }
  else if (upW.isDown && player2.body.touching.down)
  {
    player2.body.velocity.y = -350;
  }
  else
  {
    player2.animations.stop();

    player2.frame = 0;
  }

  if (cursors.left.isDown && cursors.up.isDown && player.body.touching.down)
  {
    player.body.velocity.x = -150;
    player.body.velocity.y = -350;
    player.animations.play('left');
  }
  else if (cursors.right.isDown && cursors.up.isDown && player.body.touching.down)
  {
    player.body.velocity.x = 150;
    player.body.velocity.y = -350;
    player.animations.play('right');
  }
  else if (cursors.left.isDown)
  {
    player.body.velocity.x = -150;
    player.animations.play('left');
  }
  else if (cursors.right.isDown)
  {
    player.body.velocity.x = 150;
    player.animations.play('right');
  }
  else if (cursors.up.isDown && player.body.touching.down)
  {
    player.body.velocity.y = -350;
  }
  else
  {
    player.animations.stop();

    player.frame = 0;
  }


}


function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {

        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
          // var straightBullet = bullet
          // straightBullet.angle +=90;
          if (cursors.left.isDown){
            bullet.angle = 0;
            bullet.reset(player.x -30, player.y );
            bullet.body.velocity.x = -400;
            bulletTime = game.time.now + 200;
          }else if(cursors.right.isDown){
            bullet.angle = 0;
            bullet.reset(player.x +30, player.y );
            bullet.body.velocity.x = 400;
            bulletTime = game.time.now + 200;
          } else {
            bullet.angle = 90;
            bullet.reset(player.x + 3, player.y -20 );
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
          }
        }
      }

    }


    function fireBullet2 () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime2)
    {
        //  Grab the first bullet we can from the pool
        bullet2 = bullets2.getFirstExists(false);

        if (bullet2)
        {
          if (leftA.isDown){

            bullet2.reset(player2.x -30, player2.y +20 );
            bullet2.body.velocity.x = -400;
            bulletTime2 = game.time.now + 200;
          }else if(rightD.isDown){

            bullet2.reset(player2.x +30, player2.y +20 );
            bullet2.body.velocity.x = 400;
            bulletTime2 = game.time.now + 200;
          } else {
           bullet2.reset(player2.x + 14, player2.y );
           bullet2.body.velocity.y = -400;
           bulletTime2 = game.time.now + 200;
         }
       }
     }

   }


   function collisionHandler (bullet, star) {

    //  When a bullet hits an star we kill them both
    bullet.kill();
    star.kill();

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.play('kaboom', 30, false, true);
    explosion.reset(star.body.x - 50, star.body.y - 50);
    if (bullets2.children.indexOf(bullet) > -1) {
      score2 += 10
      scoreText2.text = 'player 2 score: ' + score2;
    } else {
      score += 10;
      scoreText.text = 'player 1 score: ' + score;
    }
  }

  function playercollisionHandler (star, bullet) {

    bullet.kill();

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.play('kaboom', 30, false, true);
    explosion.reset(star.body.x - 50, star.body.y - 50);
    if (bullets2.children.indexOf(bullet) > -1) {
      score2 += 10
      scoreText2.text = 'player 2 score: ' + score2;
    } else {
      score += 10;
      scoreText.text = 'player 1 score: ' + score;
    }
  }

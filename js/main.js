function main(){

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    var platforms;

    var score = 0;
    var scoreText;
    var gameText1;
    var gameText2;
    var gameText3;
    var gameTextOffset = 30;
    var index1, index2, index3, i;

    var state = "start";


    var questionMax = 2;
    var questions = {
        "qs":[
            {"q":"this is the first line", "a":3},
            {"q":"this is the second line", "a":2},
            {"q":"this is the third line", "a":1}
        ]



    }


    function preload() {

        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    }


    function create() {

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        var ledge = platforms.create(400, 400, 'ground');

        ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');

        ledge.body.immovable = true;

            // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 200;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        scoreText = game.add.text(16, 16, 'CATS: ', { fontSize: '32px', fill: '#000' });
        gameText1 = game.add.text(16, 300, 'hello', { fontSize: '32px', fill: '#000' });
        gameText2 = game.add.text(16, 300 + gameTextOffset, 'hello', { fontSize: '32px', fill: '#000' });
        gameText3 = game.add.text(16, 300 + gameTextOffset * 2, 'hello', { fontSize: '32px', fill: '#000' });
         
        gameText1.visible = false;
        gameText2.visible = false;
        gameText3.visible = false;


        cursors = game.input.keyboard.addKeys( { 
                        'up': Phaser.KeyCode.W,
                        'down': Phaser.KeyCode.S, 
                        'left': Phaser.KeyCode.A, 
                        'right': Phaser.KeyCode.D,
                        'three': Phaser.KeyCode.THREE,
                        'two': Phaser.KeyCode.TWO,
                        'one': Phaser.KeyCode.ONE
                         } );

       stars = game.add.group();

        stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++)
        {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 6;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }
    }




    function update() {
            //  Collide the player and the stars with the platforms
        var hitPlatform = game.physics.arcade.collide(player, platforms);
            //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -250;

            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 250;

            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down && hitPlatform)
        {
            player.body.velocity.y = -350;
        }

        {  game.physics.arcade.collide(stars, platforms);

            if (state == "start"){
                game.physics.arcade.overlap(player, stars, collectStar, null, this);
            }
        }


        if (state == "question") { 
             
            if (cursors.one.isDown){
                i = index1; 
                state = "number";
            } else if (cursors.two.isDown){
                i = index2;
                state = "number";
            } else if (cursors.three.isDown){
                i = index3;
                state = "number";

            }

        

        }     

        if (state == "number") {
            gameText1.visible = false; 
            gameText2.visible = false; 
            gameText3.visible = false;  
           

            console.log("i = " + i);

            score += questions.qs[i].a;
            scoreText.text = 'CATS: ' + score;

            state = "start";

        }

    }

    function collectStar (player, star) {

        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        // score += 10;

        gameText1.visible = true;
        gameText2.visible = true;
        gameText3.visible = true;

        index1 = randomQ ();
        index2 = randomQ ();
        index3 = randomQ ();

        gameText1.text = questions.qs[index1].q;
        gameText2.text = questions.qs[index2].q;
        gameText3.text = questions.qs[index3].q;
        
        state = "question";
        // var i;

        // if (cursors.one.isDown){
        //     i = index1;

        // } else if (cursors.two.isDown){
        //     i = index2;

        // } else if (cursors.three.isDown){
        //     i = index3;
        // }

        // console.log("i = " + i);

        // score += questions.qs[i].a;
        // scoreText.text = 'score: ' + score;

    }

    function randomQ () {
        return Math.floor(Math.random() * (questionMax - 0 + 1)) + 0;

    }


}


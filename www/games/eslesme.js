/**
 * Created by sercand on 09/06/15.
 */


function runEslemeGame($state) {

    var currentGame = {
        active_sprite: null,
        target_sprite: null,
        danger_sprites: [],
        state: 0,
        level: -1,
        category: null
    };
    var menuGroup, gameGroup;

    var image_categories = [
        {
            category: "ev",
            icon_url: "sandalye.jpg",
            images: [
                {id: "ev1", url: "calismamasasi.jpg"},
                {id: "ev2", url: "kanepe.jpg"},
                {id: "ev3", url: "kettle.jpg"},
                {id: "ev4", url: 'masalambasi.jpg'},
                {id: "ev5", url: 'mikser.jpg'},
                {id: "ev6", url: 'saat.jpg'},
                {id: "ev7", url: 'sackurutma.jpg'},
                {id: "ev8", url: 'sandalye.jpg'},
                {id: "ev9", url: 'telefon.jpg'},
                {id: "ev10", url: 'yemekmasasi.jpg'}
            ]
        },
        {
            category: "banyo",
            icon_url: "sivisabun.jpg",
            images: [
                {id: "banyo1", url: "banyolifi.jpg"},
                {id: "banyo2", url: "bornoz.jpg"},
                {id: "banyo3", url: "disfircasi.jpg"},
                {id: "banyo4", url: 'dismacunu.jpg'},
                {id: "banyo5", url: 'havlu.jpg'},
                {id: "banyo6", url: 'sampuan.jpg'},
                {id: "banyo7", url: 'sackurutma.jpeg'},
                {id: "banyo8", url: 'sivisabun.jpg'},
                {id: "banyo9", url: 'tarak.jpg'},
                {id: "banyo10", url: 'tuvaletkagidi.jpg'}
            ]
        },
        {
            category: "giysi",
            icon_url: "kazak.png",
            images: [
                {id: "giysi1", url: "bere.jpg"},
                {id: "giysi2", url: "bot.jpg"},
                {id: "giysi3", url: "etek.jpg"},
                {id: "giysi4", url: 'kazak.png'},
                {id: "giysi5", url: 'sal.jpg'},
                {id: "giysi6", url: 'sapka.jpg'},
                {id: "giysi7", url: 'sort.jpg'},
                {id: "giysi8", url: 'sporayakkabi.jpg'},
                {id: "giysi9", url: 'tshirt.jpg'}
            ]
        }
    ];
    var audio_yanlis, audio_dogru, audio_bitti;

    var elm = document.getElementById("game-area");
    console.log(elm);
    var game = new Phaser.Game(1024, 768, Phaser.CANVAS, elm, {
        preload: preload,
        create: create,
        update: update
    });

    function preload() {
        game.load.image('back_button', "assets/back_button.png");
        game.load.atlas('atlas', 'assets/atlas.png', 'assets/atlas.json');

        game.load.audio('yanlis', 'assets/banyoses/yanlis.mp3');
        game.load.audio('dogru', 'assets/banyoses/dogru.mp3');
        game.load.audio('gorevbitti', 'assets/renkses/aferingorevbitti.mp3');

    }

    function back_click() {
        if (currentGame.state == 0) {
            console.log("Go to game list");
            $state.go('dash');
        } else {
            showMenu();
            hideGame();
        }
    }

    function create() {

        game.stage.backgroundColor = '#337799';

        menuGroup = game.add.group();

        var btn = game.add.button(0, 0, 'back_button', back_click, this);
        btn.scale.set(0.5, 0.5);
        createMenu();
        audio_yanlis = game.add.audio('yanlis');
        audio_dogru = game.add.audio('dogru');
        audio_bitti = game.add.audio('gorevbitti');
    }

    function addButton(category, x, y) {

        function buttonClicked() {
            console.log("button clicked", category.category);
            hideMenu();
            currentGame.category = category;
            currentGame.level = 0;
            createGame(category.images);
            showGame();
        }

        var button = game.make.button(x, y, "atlas", buttonClicked, this, category.icon_url, category.icon_url, category.icon_url);
        button.anchor.set(0.5, 0.5);
        menuGroup.add(button);
        var style = {font: "24px Arial", fill: "#ffffff", align: "center"};
        var text = game.make.text(x, y + 150, category.category, style);
        text.anchor.set(0.5, 0.5);
        menuGroup.add(text);

    }

    function createMenu() {
        //create back button
        //create title
        //create buttons by image_categories

        //HEADER
        var style = {font: "32px Arial", fill: "#ff0044", align: "center"};
        var text = game.add.text(game.world.centerX, game.height * 0.08, "Esleme Oyunu", style);
        menuGroup.add(text);
        text.anchor.set(0.5, 0.5);

        //CATEGORIES

        var h = game.height * 0.84;
        var hh = h / 3.0;
        var ww = game.width / 3;
        var sx = ww / 2;
        var sy = game.height * 0.16 + hh / 2;
        console.log(h, hh, ww, sx, sy);

        for (var i = 0; i < image_categories.length; i++) {
            var yi = Math.floor(i / 3);
            var xi = i % 3;

            addButton(image_categories[i], sx + xi * ww, game.world.centerY);
        }
    }

    function hideMenu() {
        menuGroup.visible = false;
    }

    function showMenu() {
        currentGame.state = 0;
        menuGroup.visible = true;
    }

    function hideGame() {
        var gr = gameGroup;
        if (!gr)return;
        gameGroup = null;
        var tween = game.add.tween(gr)
            .to({y: 1000}, 250)
            .start()
            .onComplete.addOnce(function () {
                gr.destroy(true);
            }, this);
    }

    function showGame() {
        currentGame.state = 1;
        if (gameGroup)
            gameGroup.visible = true;
    }

    function hideSprite(sprite) {
        game.add.tween(sprite)
            .to({alpha: 0}, 150)
            .start();
    }

    function moveSpriteTo(sprite, toLeft, done) {
        //  Here we create a tween on the sprite created above
        var tween = game.add.tween(sprite);
        tween.to({y: game.world.centerY, x: (toLeft ? 200 : 600)}, 300);
        //  And this starts it going
        tween.start();


        var t1 = game.add.tween(sprite.scale)
            .to({x: 1.5, y: 1.5}, 200)
            .to({x: 0.8, y: 0.8}, 200)
            .repeatAll(3)
            .start();
        if (done)
            t1.onComplete.addOnce(done, this);
    }

    function createGame(images) {
        gameGroup = game.add.group();

        var rndImages = [];
        while (rndImages.length < 3) {
            var img = game.rnd.pick(images);
            var founded = false;
            for (var i = 0; i < rndImages.length; i++) {
                var im = rndImages[i];
                if (im.id === img.id) {
                    founded = true;
                    break;
                }
            }
            if (!founded)
                rndImages.push(img);
        }

        var left = game.rnd.pick(rndImages);

        var t = 200;
        currentGame.danger_sprites = [];
        for (var j = 0; j < 3; j++) {
            var rid = rndImages[j].id;
            var tempSprite = gameGroup.create(650, 100 + t * j, "atlas", rndImages[j].url);
            tempSprite.anchor.x = 0.5;
            tempSprite.anchor.y = 0.5;
            tempSprite.scale.set(0.72, 0.72);
            tempSprite.inputEnabled = false;
            if (rid == left.id) {
                currentGame.target_sprite = tempSprite;
            } else {
                currentGame.danger_sprites.push(tempSprite);
            }
        }

        currentGame.active_sprite = gameGroup.create(150, game.world.centerY, "atlas", left.url);
        currentGame.active_sprite.anchor.x = 0.5;
        currentGame.active_sprite.anchor.y = 0.5;
        currentGame.active_sprite.scale.set(0.72, 0.72);

        currentGame.active_sprite.inputEnabled = true;
        currentGame.active_sprite.input.enableDrag(false, true);
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    }

    function goToNext() {
        if (currentGame.level < 5) {
            hideGame();
            setTimeout(function () {
                console.log("This is next");
                createGame(currentGame.category.images);
                currentGame.level++;
                currentGame.state = 1;
            }, 400);
        } else {
            audio_bitti.play();
            console.log("you won bitch");
            setTimeout(function () {
                showMenu();
                hideGame();
            }, 300)
        }
    }

    function update() {
        if (!currentGame.active_sprite
            || !currentGame.target_sprite
            || currentGame.state != 1) {
            return;
        }
        if (checkOverlap(currentGame.active_sprite, currentGame.target_sprite)) {
            console.log("WON");
            audio_dogru.play();
            currentGame.state = 2;
            currentGame.active_sprite.inputEnabled = false;
            moveSpriteTo(currentGame.target_sprite, false);
            hideSprite(currentGame.danger_sprites[0]);
            hideSprite(currentGame.danger_sprites[1]);
            moveSpriteTo(currentGame.active_sprite, true, function () {
                goToNext();
            });

            return;
        }
        for (var i = 0; i < 2; i++) {
            if (checkOverlap(currentGame.active_sprite, currentGame.danger_sprites[i])) {
                audio_yanlis.play();
                currentGame.active_sprite.x = 150;
                currentGame.active_sprite.y = game.world.centerY;
                return;
            }
        }
    }


}
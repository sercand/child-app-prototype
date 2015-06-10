/**
 * Created by sercand on 09/06/15.
 */


function runBiriniSecGame($state, socket, gamedata) {

    var currentGame = {
        correct_image: null,
        danger_sprites: [],
        active_sprite: null,
        state: 0,
        level: -1
    };
    var menuGroup, gameGroup;

    var images = [
        {
            id: "banyolifi",
            audio: "banyolifi.mp3",
            audio_show: "banyolifigoster.mp3",
            image: "banyolifi.jpg",
            name: "Banyo Lifi"
        }, {
            id: "bornoz",
            audio: "bornoz.mp3",
            audio_show: "bornozugoster.mp3",
            image: "bornoz.jpg",
            name: "Bornoz"
        }, {
            id: "disfircasi",
            audio: "disfircasi.mp3",
            audio_show: "disfircasinigoster.mp3",
            image: "disfircasi.jpg",
            name: "Diş Fırçası"
        }, {
            id: "havlu",
            audio: "havlu.mp3",
            audio_show: "havluyugoster.mp3",
            image: "havlu.jpg",
            name: "Havlu"
        }, {
            id: "sackurutma",
            audio: "sackurutmamakinesi.mp3",
            audio_show: "sackurutmamakinesinigoster.mp3",
            image: "sackurutma.jpg",
            name: "Saç Kurutma Makinası"
        }, {
            id: "sampuan",
            audio: "sampuan.mp3",
            audio_show: "sampuanigoster.mp3",
            image: "sampuan.jpg",
            name: "Şampuan"
        }, {
            id: "sivisabun",
            audio: "sivisabun.mp3",
            audio_show: "sivisabunugoster.mp3",
            image: "sivisabun.jpg",
            name: "Sıvı Sabun"
        }, {
            id: "tarak",
            audio: "tarak.mp3",
            audio_show: "taragigoster.mp3",
            image: "tarak.jpg",
            name: "Tarak"
        }, {
            id: "tuvaletkagidi",
            audio: "tuvaletkagidi.mp3",
            audio_show: "tuvaletkagidigoster.mp3",
            image: "tuvaletkagidi.jpg",
            name: "Tuvalet Kağıdı"
        }
    ];
    var audio_yanlis, audio_dogru, audio_bitti;

    var elm = document.getElementById("game-area");
    console.log(elm);
    var game = new Phaser.Game(1024, 768, Phaser.CANVAS, elm, {
        preload: preload,
        create: create
    });

    function preload() {
        game.load.image('back_button', "assets/back_button.png");
        game.load.atlas('atlas', 'assets/atlas.png', 'assets/atlas.json');

        game.load.audio('yanlis', 'assets/banyoses/yanlis.mp3');
        game.load.audio('dogru', 'assets/banyoses/dogru.mp3');
        game.load.audio('gorevbitti', 'assets/renkses/aferingorevbitti.mp3');

        for (var i = 0; i < images.length; i++) {
            var im = images[i];
            game.load.audio(im.id, 'assets/banyoses/' + im.audio);
            game.load.audio(im.id + "_show", 'assets/banyoses/' + im.audio_show);
        }
    }

    function back_click() {
        if (currentGame.state == 0) {
            console.log("Go to game list");
            socket.emit('game:end', {game_id: gamedata.id});
            $state.go('dash');
        } else {
            showMenu();
            hideGame();
        }
    }

    function shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    function create() {

        game.stage.backgroundColor = '#EDF0F5';

        menuGroup = game.add.group();

        var btn = game.add.button(0, 0, 'back_button', back_click, this);
        btn.scale.set(0.5, 0.5);
        createMenu();
        audio_yanlis = game.add.audio('yanlis');
        audio_dogru = game.add.audio('dogru');
        audio_bitti = game.add.audio('gorevbitti');

        for (var i = 0; i < images.length; i++) {
            images[i].sfx = game.add.audio(images[i].id);
            images[i].sfx_show = game.add.audio(images[i].id + "_show");
        }
        shuffle(images);
        socket.emit('game:start', {game_id: gamedata.id});
    }

    function addButton(x, y) {

        function buttonClicked() {
            hideMenu();
            currentGame.level = 0;
            createGame(images);
            showGame();
        }

        var button = game.make.button(x, y, "atlas", buttonClicked, this, "back_button.png", "back_button.png", "back_button.png");
        button.anchor.set(0.5, 0.5);
        button.angle = 180;
        menuGroup.add(button);
        var style = {font: "24px Arial", fill: "#75BFB2", align: "center"};
        var text = game.make.text(x, y + 150, "Basla", style);
        text.anchor.set(0.5, 0.5);
        menuGroup.add(text);
    }

    function addGameButton(img, x, y) {

        function buttonClicked() {
            checkInput(img);
        }

        var button = game.make.button(x, y, "atlas", buttonClicked, this, img.image, img.image, img.image);
        button.anchor.set(0.5, 0.5);
        gameGroup.add(button);
        return button;
    }

    function checkInput(img) {
        if (currentGame.correct_image == img.id) {
            img.sfx.play();
            currentGame.state = 2;
            socket.emit('answer:correct', {game_id: gamedata.id});
            hideSprite(currentGame.danger_sprites[0]);
            hideSprite(currentGame.danger_sprites[1]);
            moveSpriteTo(currentGame.active_sprite, function () {
                goToNext();
            });
        } else {
            audio_yanlis.play();
            socket.emit('answer:wrong', {game_id: gamedata.id});

        }
    }

    function createMenu() {
        var style = {font: "32px Arial", fill: "#2AAEFF", align: "center"};
        var text = game.add.text(game.world.centerX, game.height * 0.08, "Birini Seçme Oyunu", style);
        menuGroup.add(text);
        text.anchor.set(0.5, 0.5);

        addButton(game.world.centerX, game.world.centerY);
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

    function moveSpriteTo(sprite, done) {
        //  Here we create a tween on the sprite created above
        var tween = game.add.tween(sprite);
        tween.to({y: game.world.centerY, x: game.world.centerX}, 300);
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

        var rndImages = [images[currentGame.level]];
        var left = rndImages[0];

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

        shuffle(rndImages);

        currentGame.danger_sprites = [];

        var t = game.width / 6;

        for (var j = 0; j < 3; j++) {
            var rid = rndImages[j].id;

            var tempSprite = addGameButton(rndImages[j], t + j * (t * 2), 350);

            if (rid == left.id) {
                currentGame.active_sprite = tempSprite;
            } else {
                currentGame.danger_sprites.push(tempSprite);
            }
        }

        var style = {font: "32px Arial", fill: "#2AAEFF", align: "center"};
        var text = game.add.text(game.world.centerX, game.height * 0.12, left.name, style);
        gameGroup.add(text);
        text.anchor.set(0.5, 0.5);

        left.sfx_show.play();
        currentGame.correct_image = left.id;
    }

    function goToNext() {
        if (currentGame.level < 5) {
            hideGame();
            setTimeout(function () {
                console.log("This is next");
                currentGame.level++;
                createGame(images);
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

}
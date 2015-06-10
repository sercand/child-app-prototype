/**
 * Created by sercand on 09/06/15.
 */


function runBiRenkSecGame($state) {

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
            id: "kirmizi",
            audio: "kirmizi.mp3",
            audio_show: "kirmiziyigoster.mp3",
            color: 0xFF0000,
            name: "Kırmızı"
        }, {
            id: "mavi",
            audio: "mavi.mp3",
            audio_show: "maviyigoster.mp3",
            color: 0x0069FF,
            name: "Kırmızı"
        }, {
            id: "mor",
            audio: "mor.mp3",
            audio_show: "morugoster.mp3",
            color: 0x8E05FF,
            name: "Mor"
        }, {
            id: "sari",
            audio: "sari.mp3",
            audio_show: "sariyigoster.mp3",
            color: 0xFFFF00,
            name: "Sarı"
        }, {
            id: "siyah",
            audio: "siyah.mp3",
            audio_show: "siyahigoster.mp3",
            color: 0x000000,
            name: "Siyah"
        }, {
            id: "turuncu",
            audio: "turuncu.mp3",
            audio_show: "turuncuyugoster.mp3",
            color: 0xFF530D,
            name: "Turuncu"
        }, {
            id: "yesil",
            audio: "yesil.mp3",
            audio_show: "yeşiligoster.mp3",
            color: 0x00FF00,
            name: "Yeşil"
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
            game.load.audio(im.id, 'assets/renkses/' + im.audio);
            game.load.audio(im.id + "_show", 'assets/renkses/' + im.audio_show);
        }
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
        shuffle(images)
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

        var button = game.make.button(x, y, "atlas", buttonClicked, this, "boskare.png", "boskare.png", "boskare.png");
        button.tint = img.color;
        button.anchor.set(0.5, 0.5);
        gameGroup.add(button);
        return button;
    }

    function checkInput(img) {
        if (currentGame.correct_image == img.id) {
            img.sfx.play();
            currentGame.state = 2;
            hideSprite(currentGame.danger_sprites[0]);
            hideSprite(currentGame.danger_sprites[1]);
            moveSpriteTo(currentGame.active_sprite, function () {
                goToNext();
            });
        } else {
            audio_yanlis.play();
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
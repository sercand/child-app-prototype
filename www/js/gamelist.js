/**
 * Created by sercand on 09/06/15.
 */



var playableGameList = [
    {
        id: "5576cbff4a2caa680b4318fc",
        name: "Esya Eslesme Oyunu",
        logo: "../img/app1.png",
        run: function (state) {
            runEslemeGame(state);
        }
    },
    {
        id: "557785d85c21a8d378fce8bc",
        name: "Renk Eslesme Oyunu",
        logo: "../img/app2.png",
        run: function (state) {
            runRenkGame(state);
        }
    },
    {
        id: "557785d85c21a8d378fce8bc",
        name: "Bir Renk Sec",
        logo: "../img/app3.png",
        run: function (state) {
            runBiRenkSecGame(state);
        }
    },
    {
        id: "557785f55c21a8d378fce8bd",
        name: "Birini Sec",
        logo: "../img/app4.png",
        run: function (state) {
            runBiriniSecGame(state);
        }
    }
];

function findGameFromList(id) {
    for (var i = 0; i < playableGameList.length; i++) {
        if (playableGameList[i].id == id) {
            return playableGameList[i];
        }
    }
    return null;
}
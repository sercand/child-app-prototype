/**
 * Created by sercand on 09/06/15.
 */



var playableGameList = [
    {
        id: "5576cbff4a2caa680b4318fc",
        name: "Eslesme oyunu",
        logo: "https://s3.eu-central-1.amazonaws.com/otsimo/esleme/logo.png",
        run: function (state) {
            runBiRenkSecGame(state);
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
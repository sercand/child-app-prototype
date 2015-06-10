/**
 * Created by Zafer on 9.6.2015.
 */
var nextgame = null;
angular.module('starter.controllers', [])

    .controller('DashCtrl', function ($scope, $state, $http, Auth) {

        $scope.openGame = function (game) {
            console.log(game.name);
            nextgame = game;
            $state.go('game');
        };

        $scope.chunkedData = [];

        function addToChunkedData(data) {
            console.log(data);
            if ($scope.chunkedData.length === 0) {
                $scope.chunkedData.push([data]);
            } else {
                var last = $scope.chunkedData[$scope.chunkedData.length - 1];
                if (last.length === 4) {
                    $scope.chunkedData.push([data]);
                } else {
                    last.push(data);
                }
            }
            $scope.$$phase || $scope.$apply();
        }

        function loadGames(games) {
            for (var i = 0; i < games.length; i++) {
                if (!games[i].active)continue;
                var g = findGameFromList(games[i].id);
                if (g) {
                    g.itIsLocal = true;
                    addToChunkedData(g);
                } else {
                    $http.get(Auth.apiUrl + '/game/' + games[i].id)
                        .success(function (data) {
                            if (data.success) {
                                data.data.itIsLocal = false;
                                addToChunkedData(data.data);
                            }
                        })
                        .error(function (data) {
                            console.log("ERROR", data);
                        });
                }
            }
        }

        loadGames(Auth.child.games);
    })

    .controller('GameCtrl', function ($scope, $ionicLoading, $state) {
        $scope.isReady = function () {
            console.log("IS READY");
        };
        console.log(nextgame.name);
        if (typeof nextgame.run === 'function') {
            nextgame.run($state);
        }
    })
    .controller('LoginCtrl', function ($scope, $ionicModal, $timeout, $ionicLoading, $ionicPopup, $state, Auth) {
        // Form data for the login modal
        $scope.loginData = {};

        $scope.doLogin = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var lData = $scope.loginData;
            Auth.login(lData.email, lData.password, function (err) {
                if (err) {
                    $ionicLoading.hide();
                    console.log(JSON.stringify(err));
                    var alertPopup = $ionicPopup.alert({
                        title: "Login Error",
                        template: err.message || err
                    });
                    alertPopup.then(function (res) {
                        console.log('Thank you for not eating my delicious ice cream cone');
                    });

                    return;
                }
                $scope.loginData = {};
                $state.go('dash');
                $ionicLoading.hide();

            });
        };
    });


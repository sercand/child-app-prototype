/**
 * Created by Zafer on 9.6.2015.
 */
angular.module('starter.controllers', [])

    .controller('DashCtrl', function ($scope, $http, Auth) {

        var games = [
            {logo: "img/cover.jpg", id: ""},
            {logo: "img/cover.jpg", id: ""},
            {logo: "img/cover.jpg", id: ""},
            {logo: "img/cover.jpg", id: ""},
            {logo: "img/cover.jpg", id: ""},
            {logo: "img/cover.jpg", id: ""},
            {logo: "img/cover.jpg", id: ""},
            {logo: "img/cover.jpg", id: ""},
            {logo: "img/cover.jpg", id: ""}
        ];

        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }

            return newArr;
        }

        $scope.openGame = function (game) {
            console.log(game.name);
        };

        $scope.chunkedData = [];

        function loadGames(games) {
            for (var i = 0; i < games.length; i++) {
                if (!games[i].active)continue;

                $http.get(Auth.apiUrl + '/game/' + games[i].id)
                    .success(function (data) {
                        if (data.success) {
                            console.log(data.data);
                            if ($scope.chunkedData.length === 0) {
                                $scope.chunkedData.push([data.data]);
                            } else {
                                var last = $scope.chunkedData[$scope.chunkedData.length - 1];
                                if (last.length === 4) {
                                    $scope.chunkedData.push([data.data]);
                                } else {
                                    last.push(data.data);
                                }
                            }
                            $scope.$$phase || $scope.$apply();
                        }
                    })
                    .error(function (data) {
                        console.log("ERROR", data);
                    });
            }
        }

        loadGames(Auth.child.games);

    })

    .controller('GameCtrl', function ($scope) {
        $scope.info =
        {
            gameName: 'Zafer Oyunda'
        };
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

                /*   setTimeout(function () {

                 }, 1000);*/

            });
        };
    });
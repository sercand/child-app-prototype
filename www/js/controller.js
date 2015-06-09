/**
 * Created by Zafer on 9.6.2015.
 */
angular.module('starter.controllers', [])

    .controller('DashCtrl', function ($scope) {

        var games = [
            {link: './#', img: "img/cover.jpg", name: '1'},
            {link: './#', img: "img/cover.jpg", name: '2'},
            {link: './#', img: "img/cover.jpg", name: '3'},
            {link: './#', img: "img/cover.jpg", name: '4'},
            {link: './#', img: "img/cover.jpg", name: '5'},
            {link: './#', img: "img/cover.jpg", name: '6'},
            {link: './#', img: "img/cover.jpg", name: '7'},
            {link: './#', img: "img/cover.jpg", name: '8'},
            {link: './#', img: "img/cover.jpg", name: '9'}
        ];

        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }

            return newArr;
        }

        $scope.chunkedData = chunk(games, 4);
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
/**
 * Created by Zafer on 9.6.2015.
 */
angular.module('starter.services.auth', [])
    .factory('$localStorage', function ($window) {
        return {
            set: function (key, value) {
                localStorage.setItem(key, value);
            },
            get: function (key, defaultValue) {
                return localStorage.getItem(key) || defaultValue;
            },
            setObject: function (key, value) {
                localStorage.setItem(key, JSON.stringify(value))
            },
            getObject: function (key) {
                return JSON.parse(localStorage.getItem(key) || '{}');
            }
        }
    })
    .factory('Auth', function ($http, $localStorage, DPI) {
        var authService = {};

        authService.serverUrl = "http://food.sercand.com";
        //  authService.serverUrl = "http://10.10.1.81:3000";
        authService.apiUrl = authService.serverUrl + "/api/v1";


        authService.isLoggedIn = $localStorage.getObject("isLoggedIn") | false;
        authService.user = $localStorage.getObject("user");
        authService.userId = $localStorage.getObject("userId");
        authService.nextResults = [];
        authService.picture = authService.serverUrl + DPI.picture_path + authService.user._id + "_p.jpg";

        function setUserId(id) {
            authService.userId = id;
            $localStorage.setObject("userId", id);
        }

        function setUserData(data) {
            authService.user = data;
            $localStorage.setObject("user", data);
            authService.isLoggedIn = true;
            $localStorage.setObject("isLoggedIn", true);
            authService.picture = authService.serverUrl + DPI.picture_path + authService.user._id + "_p.jpg";
        }

        authService.getProfileData = function (id, done) {
            $http.get(authService.apiUrl + '/user/profile?id=' + id)
                .success(function (data) {
                    if (data.success) {
                        done(null, data.data);
                    } else {
                        done(data.message);
                    }
                })
                .error(function (data) {
                    return done(data);
                });
        };

        authService.register = function (firstName, secondName, email, password, done) {
            var postData = {
                first_name: firstName,
                last_name: secondName,
                email: email,
                password: password
            };

            $http.post(authService.serverUrl + '/account/register/mail', postData).
                success(function (data, status, headers, config) {
                    console.log("register: " + JSON.stringify(data));
                    setUserId(data.user_id);
                    authService.getProfileData(authService.userId, function (err, doc) {
                        if (err) {
                            return done(err);
                        }
                        setUserData(doc);
                        return done(null);
                    });
                }).
                error(function (data, status, headers, config) {
                    console.error("register: " + JSON.stringify(data) + " " + status);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status
                    return done(data);
                });


        };

        authService.login = function (email, password, done) {
            var postData = {
                email: email,
                password: password
            };

            $http.post(authService.serverUrl + '/account/login/mail', postData).
                success(function (data, status, headers, config) {
                    console.log("login: " + JSON.stringify(data));

                    setUserId(data.user_id);
                    authService.getProfileData(authService.userId, function (err, doc) {
                        if (err) {
                            return done(err);
                        }
                        setUserData(doc);
                        return done(null);
                    });
                }).
                error(function (data, status, headers, config) {
                    console.error("login: " + JSON.stringify(data) + " " + status);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status
                    done(data);

                });
        };

        authService.searchMenu = function (lat, lng, done) {
            var path = authService.apiUrl + '/menu/search?lng=' + lng + '&lat=' + lat;
            $http.get(path)
                .success(function (body) {
                    done(null, body.data);
                })
                .error(function (data) {
                    done(data);
                })
        };


        if (authService.isLoggedIn) {
            authService.getProfileData(authService.userId, function (err, doc) {
                if (err) {
                    return;
                }
                return setUserData(doc);
            });
        }

        return authService;
    });
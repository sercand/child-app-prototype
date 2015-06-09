/**
 * Created by Zafer on 9.6.2015.
 */
angular.module('starter.auth', [])
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
    .factory('Auth', function ($http, $localStorage) {
        var authService = {
            get parentId() {
                return $localStorage.get('parent_id', null);
            },
            set parentId(id) {
                return $localStorage.set('parent_id', id)
            },
            get childId() {
                return $localStorage.get('child_id', null);
            },
            set childId(id) {
                return $localStorage.set('child_id', id);
            }
        };

        authService.serverUrl = "http://localhost:6001";
        //  authService.serverUrl = "http://10.10.1.81:3000";
        authService.apiUrl = authService.serverUrl + "/api/v1";


        authService.isLoggedIn = $localStorage.getObject("isLoggedIn") | false;

        authService.parent = $localStorage.getObject("parent");
        authService.child = $localStorage.getObject("child");
        authService.nextResults = [];

        function setParentData(data) {
            authService.parent = data;
            $localStorage.setObject("parent", data);
        }

        function setChildrenData(data) {
            authService.child = data;
            $localStorage.setObject("child", data);
            authService.isLoggedIn = true;
            $localStorage.setObject("isLoggedIn", true);
        }

        authService.getParentData = function (id, done) {
            $http.get(authService.apiUrl + '/parent/' + id)
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
        authService.getChild = function (id, done) {
            $http.get(authService.apiUrl + '/parent/' + id + '/getchildren')
                .success(function (data) {
                    if (data.success && data.data.length > 0) {
                        done(null, data.data[0]);
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

            $http.post(authService.serverUrl + '/account/register', postData).
                success(function (data, status, headers, config) {
                    console.log("register: " + JSON.stringify(data));
                    authService.parentId = data.parent_id;
                    authService.getParentData(data.parent_id, function (err, doc) {
                        if (err) {
                            return done(err);
                        }
                        setParentData(doc);
                        authService.getChild(data.parent_id, function (err, docChild) {
                            if (err) {
                                return done(err);
                            }
                            setChildrenData(docChild);
                            return done(null);
                        });
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

            $http.post(authService.serverUrl + '/account/login', postData).
                success(function (data, status, headers, config) {
                    console.log("login: " + JSON.stringify(data));

                    authService.parentId = data.parent_id;
                    authService.getParentData(data.parent_id, function (err, doc) {
                        if (err) {
                            return done(err);
                        }
                        setParentData(doc);
                        authService.getChild(data.parent_id, function (err, docChild) {
                            if (err) {
                                return done(err);
                            }
                            setChildrenData(docChild);
                            return done(null);
                        });
                    });
                }).
                error(function (data, status, headers, config) {
                    console.error("login: " + JSON.stringify(data) + " " + status);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status
                    done(data);

                });
        };


        if (authService.isLoggedIn) {
            authService.getParentData(authService.parentId, function (err, doc) {
                if (err) {
                    return;
                }
                setParentData(doc);
                authService.getChild(doc._id, function (err, docChild) {
                    if (err) {
                        return;
                    }
                    setChildrenData(docChild);
                });
            });
        }

        return authService;
    });
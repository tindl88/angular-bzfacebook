(function(){
	'use strict';

	angular
	.module('ngFacebook', [])
	.provider('$facebook', facebookProvider)
	.run(run);

	function facebookProvider(){
		var config = {
			language: 'vi_VN',
			appId: null,
			cookie: false,
			xfbml: false,
			permissions: null,
			version: 'v2.5',
			redirect: ''
		};

		this.setLanguage = function(val) {
			config.language = val;
		};

		this.setAppId = function(val) {
			config.appId = val;
		};

		this.setPermissions = function(val) {
			config.permissions = val;
		};

		this.setVersion = function(val) {
			config.version = val;
		};

		this.setCookie = function(val) {
			config.cookie = val;
		};

		this.setXfbml = function(val) {
			config.xfbml = val;
		};

		this.redirect = function(val) {
			config.redirect = val;
		};

		this.$get = function($q, $window) {
			var facebook = $q.defer();

			loadScript();

			facebook.init = function() {
				var deferred = $q.defer();

				FB.init({
					appId: config.appId,
					cookie: config.cookie,
					xfbml: config.xfbml,
					version: config.version
				});

				facebook.resolve();

				return deferred.promise;
			};

			facebook.getLoginStatus = function(){
				var deferred = $q.defer();

				facebook.promise.then(function(){
					FB.getLoginStatus(function(response) {
						deferred.resolve(response);
					});
				});

				return deferred.promise;
			};

			facebook.login = function(){
				var deferred = $q.defer();

				facebook.promise.then(function(){
					facebook.getLoginStatus().then(function(response){
						if (response.status === 'connected') {
							successCallback(response);
						} else {
							if(navigator.userAgent.match('CriOS')){
								if(response.status === 'unknown'){
									$window.open('https://www.facebook.com/dialog/oauth?client_id='+config.appId+'&redirect_uri='+config.redirect+'&scope='+config.permissions, '', null);
								} else {
									errorCallback(null);
								}
							} else {
								FB.login(function(resp) {
									if (resp.status === 'connected') {
										successCallback(resp);
									} else {
										errorCallback(resp);
									}
								}, {scope: config.permissions});
							}
						}
					});
				});

				function successCallback (resp){
					deferred.resolve(resp);
				}

				function errorCallback (resp){
					deferred.reject(resp);
				}

				return deferred.promise;
			};

			facebook.logout = function(){
				var deferred = $q.defer();

				facebook.getLoginStatus()
				.then(function(resp){
					if(resp.status === 'connected'){
						FB.logout(function(response) {
							deferred.resolve(response);
						});
					} else {
						deferred.resolve(resp);
					}
				});

				return deferred.promise;
			};

			facebook.ui = function(options){
				var deferred = $q.defer();

				options = extend({
					method: 'share'
				}, options);

				facebook.promise.then(function(){
					FB.ui(options, function(response){
						if(response){
							deferred.resolve(response);
						} else {
							deferred.reject(response);
						}
					});
				});

				return deferred.promise;
			};

			facebook.api = function(options){
				var deferred = $q.defer();

				options = extend({
					method: 'get',
					link: '/me/feed',
					params: {}
				}, options);

				facebook.promise.then(function(){
					FB.api(options.link, options.method, options.params, function(response) {
						if (!response || response.error) {
							deferred.reject(response);
						} else {
							deferred.resolve(response);
						}
					});
				});

				return deferred.promise;
			};

			facebook.parse = function(element, callback){
				var deferred = $q.defer();

				facebook.promise.then(function(){
					FB.XFBML.parse(element, function(){
						if(typeof callback === 'function')
							callback();
					});
				});

				deferred.resolve();

				return deferred.promise;
			};

			facebook.setCanvasSize = function(element){
				var deferred = $q.defer();

				facebook.promise.then(function(){
					FB.Canvas.setSize({
						width: 810,
						height: parseInt(element.innerHeight)
					});
				});

				deferred.resolve();

				return deferred.promise;
			};

			function loadScript() {
				if (document.getElementById('facebookScript')) {return;}
				var script = document.createElement('script');
				script.src = '//connect.facebook.net/'+config.language+'/sdk.js';
				script.id = 'facebookScript';
				document.body.appendChild(script);
			}

			return facebook;
		};
	}

	function run($window, $facebook){
		$window.fbAsyncInit = function() {
			$facebook.init();
			$facebook.getLoginStatus();
		};
	}

	function extend(a, b){
		for(var key in b){
			if(b.hasOwnProperty(key)){
				a[key] = b[key];
			}
		}
		return a;
	}
})();
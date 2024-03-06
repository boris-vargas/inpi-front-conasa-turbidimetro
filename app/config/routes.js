angular.module('intechApp').config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('dashboard', {
      url: "/dashboard",
      templateUrl: "_dashboard/dashboard.html"
    })
    // .state('menu1', {
    //   url: "/menu1",
    //   templateUrl: "_menu1/menu1.html"
    // })
    .state('menu2', {
      url: "/menu2",
      templateUrl: "_menu2/menu2.html"
    })
    .state('menu3', {
      url: "/menu3",
      templateUrl: "_menu3/menu3.html"
    })
    .state('menu4', {
      url: "/menu4",
      templateUrl: "_menu4/menu4.html"
    })
    .state('menu5', {
      url: "/menu5",
      templateUrl: "_menu5/menu5.html"
    })
    .state('menu6', {
      url: "/menu6",
      templateUrl: "_menu6/menu6.html"
    })
    .state('menu7', {
      url: "/menu7",
      templateUrl: "_menu7/menu7.html"
    })
    .state('menu8', {
      url: "/menu8",
      templateUrl: "_menu8/menu8.html"
    })
    .state('menu9', {
      url: "/menu9",
      templateUrl: "_menu9/menu9.html"
    })
    .state('menu10', {
      url: "/menu10",
      templateUrl: "_menu10/menu10.html"
    })
    .state('configuracoes', {
      url: "/configuracoes",
      templateUrl: "_configuracoes/configuracoes.html"
    })
    .state('configureinpi', {
      url: "/configureinpi",
      templateUrl: "_configureInPi/configureInPi.html"
    })


    $urlRouterProvider.otherwise('/dashboard')
  }])

  .run([
    '$rootScope',
    '$http',
    '$location',
    '$window',
    'auth',
    function ($rootScope, $http, $location, $window, auth) {

      validateUser()
      $rootScope.$on('$locationChangeStart',()=> validateUser())

      function validateUser(){
        //console.log('validateUser');
        const user = auth.getUser()
        const authPage = '/auth.html'
        const isAuthPage = $window.location.href.includes(authPage)

        if (!user && !isAuthPage) {
          $window.location.href = authPage
        } else if (user && !user.isValid) {

          auth.validateToken(user.token, (err, valid) => {
            if (!valid) {
              $window.location.href = authPage
              auth.logout()
            } else {
              user.isValid = true
              $http.defaults.headers.common.Authorization = user.token
              isAuthPage ? $window.location.href = '/' : ''
            }
          })
        }
      }

    }
])

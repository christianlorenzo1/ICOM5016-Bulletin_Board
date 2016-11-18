angular.module('bb', ['ionic'])

.controller('homeCtrl', function($scope, $http, $window) {
	
	$scope.uid = sessionStorage.getItem('uid');
	$scope.username = sessionStorage.getItem('username');
	$scope.email = sessionStorage.getItem('email');

	if(!$scope.username){
		$scope.loggedIn = false;
	}
	else{
		$scope.loggedIn = true;
	}

  $scope.getAnnouncements = function(){
      return $http({
        method : "GET",
        url : "/db/get/announcements"
    }).then(function mySucces(response) {
        $scope.announcements = response.data;
    $scope.statuscode = response.status;
    $scope.statustext  = response.statustext;
    console.log($scope.statuscode, "Data Retrieved.");

    }, function myError(response) {
        $scope.data = response.statusText;
    });
  };
$scope.getAnnouncements();
$scope.getPremiumPosts = function(){
      return $http({
        method : "GET",
        url : "/db/get/premiumPosts"
    }).then(function mySucces(response) {
        $scope.premiumPosts = response.data;
    $scope.statuscode = response.status;
    $scope.statustext  = response.statustext;
    console.log($scope.statuscode, "Data Retrieved.");

    }, function myError(response) {
        $scope.data = response.statusText;
    });
  };
$scope.getPremiumPosts();

$scope.transferAnnouncement = function(category,postID){
  sessionStorage.setItem('category',category);
  sessionStorage.setItem('postID',postID);
  $window.location.href = "announcement_details.html";
};

$scope.search = function(searchText){
  $scope.master = {};
  $scope.master = angular.copy(searchText);
  if($scope.master){
    return $http({
        method : "GET",
        url : "/db/get/search/"+$scope.master
        }).then(function mySucces(response) {
            $scope.announcements = response.data;
        $scope.statuscode = response.status;
        $scope.statustext  = response.statustext;
        console.log($scope.statuscode, "Data Retrieved.");

        }, function myError(response) {
            $scope.data = response.statusText;
        });
    }
    else{
      return $scope.getAnnouncements();
    }
  };

  // Mini Filter that toggles if button is clicked
  $scope.filterBooks = function(){
  	$scope.bFilter = true;
  	$scope.hFilter = false;
  	$scope.eFilter = false;
  	$scope.mFilter = false;
  	$scope.oFilter = false;
  	$scope.allFilters = false;
  }
  $scope.filterHousing = function(){
  	$scope.bFilter = false;
  	$scope.hFilter = true;
  	$scope.eFilter = false;
  	$scope.mFilter = false;
  	$scope.oFilter = false;
  	$scope.allFilters = false;
  }
  $scope.filterEvents = function(){
  	$scope.bFilter = false;
  	$scope.hFilter = false;
  	$scope.eFilter = true;
  	$scope.mFilter = false;
  	$scope.oFilter = false;
  	$scope.allFilters = false;
  }
  $scope.filterMentoring = function(){
    $scope.bFilter = false;
  	$scope.hFilter = false;
  	$scope.eFilter = false;
  	$scope.mFilter = true;
  	$scope.oFilter = false;
  	$scope.allFilters = false;
  }
  $scope.filterOther = function(){
    $scope.bFilter = false;
  	$scope.hFilter = false;
  	$scope.eFilter = false;
  	$scope.mFilter = false;
  	$scope.oFilter = true;
  	$scope.allFilters = false;
  }
  $scope.showAll = function(){
    $scope.bFilter = true;
  	$scope.hFilter = true;
  	$scope.eFilter = true;
  	$scope.mFilter = true;
  	$scope.oFilter = true;
  	$scope.allFilters = true;
  }
  $scope.showAll();
})

.controller('announcementDetailsCtrl', function($scope, $http, $window) {

  $scope.uid = sessionStorage.getItem('uid');
  $scope.username = sessionStorage.getItem('username');
  $scope.email = sessionStorage.getItem('email');

  if(!$scope.username){
    $scope.loggedIn = false;
  }
  else{
    $scope.loggedIn = true;
  }

  $scope.transfer = {category:sessionStorage.getItem('category'),
  postID: sessionStorage.getItem('postID')};

  $scope.getAnnouncementsDetails = function(){
      return $http({
        method : "GET",
        url : "/db/get/announcement/"+$scope.transfer.category+"/"+$scope.transfer.postID+"/"
    }).then(function mySucces(response) {
        $scope.announcement = response.data;
    $scope.statuscode = response.status;
    $scope.statustext  = response.statustext;
    console.log($scope.statuscode, "Data Retrieved.");

    }, function myError(response) {
        $scope.transfer = response.statusText;
    });
  };
  $scope.getAnnouncementsDetails();

  $scope.transferMessage = function(){
    sessionStorage.setItem('messageuser',$scope.announcement.uid);
    $window.location.href = "messages.html";
  }

})

.controller('messageCtrl', function($scope, $http, $window) {

  $scope.transfer = {
    messageUser:sessionStorage.getItem('messageuser'),
    loggedInUser: sessionStorage.getItem('uid')
  };

  $scope.getMessageDetails = function(){
      return $http({
        method : "GET",
        url : "/db/get/messages/"+$scope.transfer.loggedInUser+"/"
        +$scope.transfer.messageUser+"/"
    }).then(function mySucces(response) {
        $scope.messages = response.data;
        $scope.statuscode = response.status;
        $scope.statustext  = response.statustext;
        console.log($scope.statuscode, "Data Retrieved.");

    }, function myError(response) {
        $scope.transfer = response.statusText;
    });
  };
  $scope.getMessageDetails();


})

.controller('loginCtrl', function($scope, $http,$window) {

  $scope.login = function(user){
    $scope.master = {};
    $scope.master = angular.copy(user);

    if($scope.master.email && $scope.master.password){
      $http({
          method : "GET",
          url : "/db/get/login/"+$scope.master.email+"/"+$scope.master.password+"/"
      }).then(function mySucces(response) {
          $scope.user = response.data;
          $scope.statuscode = response.status;
          $scope.statustext  = response.statustext;
          console.log($scope.statuscode, "Data Retrieved.");

          if($scope.user[0]){
            sessionStorage.setItem('uid',$scope.user[0].uid);
            sessionStorage.setItem('username',$scope.user[0].username);
            sessionStorage.setItem('email',$scope.user[0].email);
            $window.location.href = "profile.html";
          }
          else{
            $scope.error = "User not found";
          }
          
          
          

      }, function myError(response) {
          $scope.error = response.statusCode + ": User not found";
      });
    
    }
    else{
      $scope.error = "Please write email and password";
    }

  };
})
.controller('profileCtrl', function($scope, $http,$window) {

  $scope.transfer = {
    uid: sessionStorage.getItem('uid'),
    username: sessionStorage.getItem('username'),
    email:sessionStorage.getItem('email')
  };

  $scope.profileDetails = function(user){

    $http({
        method : "GET",
        url : "/db/get/user/"+$scope.transfer.uid+"/"+$scope.transfer.username+
        "/"+$scope.transfer.email
    }).then(function mySucces(response) {
        $scope.user = response.data;
        $scope.statuscode = response.status;
        $scope.statustext  = response.statustext;
        console.log($scope.statuscode, "Data Retrieved.");
        

    }, function myError(response) {
        $scope.error = response.statusCode + ": User not found";

    });

  };

  $scope.profileDetails();

  $scope.profileDetails = function(user){

    $http({
        method : "GET",
        url : "/db/get/creditcards/"+$scope.transfer.uid+""
    }).then(function mySucces(response) {
        $scope.creditcards = response.data;
        $scope.statuscode = response.status;
        $scope.statustext  = response.statustext;
        console.log($scope.statuscode, "Data Retrieved.");
        

    }, function myError(response) {
        $scope.error = response.statusCode + ": User not found";

    });

  };

  $scope.profileDetails();

	$scope.chatlogs = function(){

    $http({
        method : "GET",
        url : "/db/get/chatlogs/"+$scope.user.uid
    }).then(function mySucces(response) {
        $scope.chatlogs = response.data;
        $scope.statuscode = response.status;
        $scope.statustext  = response.statustext;
        console.log($scope.statuscode, "Data Retrieved.");
        

    }, function myError(response) {
        $scope.error = response.statusCode + ": Announcements not found";

    });

  };
  $scope.transferMessage = function(messageUser){
  	$scope.master = {};
  	$scope.master = angular.copy(messageUser);
    sessionStorage.setItem('messageuser',$scope.master);
    $window.location.href = "messages.html";
  }

  $scope.announcementHistory = function(){

    $http({
        method : "GET",
        url : "/db/get/user/announcements/"+$scope.user.uid
    }).then(function mySucces(response) {
        $scope.announcements = response.data;
        $scope.statuscode = response.status;
        $scope.statustext  = response.statustext;
        console.log($scope.statuscode, "Data Retrieved.");
        

    }, function myError(response) {
        $scope.error = response.statusCode + ": Announcements not found";

    });

  };
  $scope.transferAnnouncement = function(category,postID){
    sessionStorage.setItem('category',category);
    sessionStorage.setItem('postID',postID);
    $window.location.href = "announcement_details.html";
  };

  $scope.paymentHistory = function(){

    $http({
        method : "GET",
        url : "/db/get/user/payments/"+$scope.user.uid
    }).then(function mySucces(response) {
        $scope.payments = response.data;
        $scope.statuscode = response.status;
        $scope.statustext  = response.statustext;
        console.log($scope.statuscode, "Data Retrieved.");
        

    }, function myError(response) {
        $scope.error = response.statusCode + ": Announcements not found";

    });

  };

  $scope.logout = function(){
	  sessionStorage.removeItem('uid');
	  sessionStorage.removeItem('username');
	  sessionStorage.removeItem('email');
	  $window.location.href = "index.html";
  }


})

.controller('adminCtrl', function($scope, $http,$window) {

  $scope.transfer = {
    uid: sessionStorage.getItem('uid')
  };

  $scope.getAdmin = function(){

    $http({
        method : "GET",
        url : "/db/get/admin/"+$scope.transfer.uid
    }).then(function mySucces(response) {
        $scope.admin = response.data;
        $scope.statuscode = response.status;
        $scope.statustext  = response.statustext;
        console.log($scope.statuscode, "Data Retrieved.");
        

    }, function myError(response) {
        $scope.error = response.statusCode + ": Announcements not found";

    });

  };
  $scope.getAdmin();

  $scope.getReports = function(){

    $http({
        method : "GET",
        url : "/db/get/reports/"
    }).then(function mySucces(response) {
        $scope.reports = response.data;
        $scope.statuscode = response.status;
        $scope.statustext  = response.statustext;
        console.log($scope.statuscode, "Data Retrieved.");
        

    }, function myError(response) {
        $scope.error = response.statusCode + ": Announcements not found";

    });


  };
  $scope.getReports();

  $scope.getAnnouncementsDetails = function(category,postID){
      return $http({
        method : "GET",
        url : "/db/get/announcement/"+category+"/"+postID+"/"
    }).then(function mySucces(response) {
        $scope.announcement = response.data;
    $scope.statuscode = response.status;
    $scope.statustext  = response.statustext;
    console.log($scope.statuscode, "Data Retrieved.");

    }, function myError(response) {
        $scope.transfer = response.statusText;
    });
  };

  $scope.logout = function(){
    sessionStorage.removeItem('uid');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    $window.location.href = "index.html";
  }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
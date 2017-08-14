var main = angular.module('main-AngularVer', []);

main.controller('maincontroller', function ($scope, $http, $interval) {
    $scope.songSuggest = [];
    $scope.songList = [];
    $scope.nowPlay = {};
    $scope.nowPlayNum = {}
    $scope.nowSrc = ''
    $scope.musicTime = ''
    var audioControl = document.getElementById("audio");
    var timer = null;
    //搜索函数search()
    $scope.search = function () {
        $scope.showFlag = true;
        $http({
            method: 'get',
            url: 'http://route.showapi.com/213-1?showapi_appid=42474&showapi_sign=492eb17362f84ed9b5bd7951f64fa5ee&keyword=' + $scope.text,
        }).then(function (res) {
            var data = res.data;
            $scope.songSuggest.splice(0, 10);
            if (data.showapi_res_body.pagebean.contentlist.length === 0) {
                return;
            } else {
                var contentlistLength = data.showapi_res_body.pagebean.contentlist.length;
                for (i = 0; i < 10 && i < contentlistLength; i++) {
                    $scope.songSuggest.push({
                        songName: data.showapi_res_body.pagebean.contentlist[i].songname,
                        singer: data.showapi_res_body.pagebean.contentlist[i].singername,
                        url: data.showapi_res_body.pagebean.contentlist[i].m4a,
                        cover: data.showapi_res_body.pagebean.contentlist[i].albumpic_big
                    })
                }
            }
        })
    }
    //console.log(angular.element("document"))
    //绑定页面点击事件，关闭下拉菜单
    /*$(document).on("click", function (e) {
        var target = e.target;
        if (target.id != "search-suggest") {
            $scope.$apply(function () {
                $scope.showFlag = false;
            })
        }
    })*/
    //$scope.trueUrl = null
    function PrefixInteger(num) {
        if (num < 10) {
            return '0' + num
        } else {
            return num
        }
    }
    //添加下拉列表add()
    $scope.add = function (selected) {
        $scope.showFlag = false;
        $scope.songList.unshift({
            songName: selected.songName,
            singer: selected.singer,
            url: selected.url,
            cover: selected.cover
        })
        $scope.nowPlay = {
            songName: selected.songName,
            singer: selected.singer,
            url: selected.url,
            cover: selected.cover,
        }
        console.log($scope.nowPlay)
        $scope.nowPlayNum = {
            num: 1,
            length: $scope.songList.length
        }
        function PrefixInteger(num) {
            if (num < 10) {
                return '0' + num
            } else {
                return num
            }
        }
        oprogressCircle.style.left = 0 + 'px';
        clearInterval(timer);
        timer = $interval(function () {
            var minuteNum = PrefixInteger(parseInt((audioControl.duration - audioControl.currentTime) / 60), 2);
            var secondNum = PrefixInteger(parseInt((audioControl.duration - audioControl.currentTime) % 60), 2);
            $scope.musicTime = '-' + minuteNum + ':' + secondNum;
            oprogressLight.style.width = audioControl.currentTime / audioControl.duration * 550 + 'px';
            oprogressCircle.style.left = audioControl.currentTime / audioControl.duration * 550 + 'px';
        }, 1000);
        $scope.isPlay = false;
        $scope.listNum = $scope.nowPlayNum.num + '/' + $scope.songList.length
    }
    //正在播放高亮
    $scope.addClass = function (songName, singer) {
        if (songName === $scope.nowPlay.songName && singer === $scope.nowPlay.singer) {
            return 'activeRow'
        }
    }
    //删除列表delete()
    $scope.delete = function (i) {
        $scope.songList.splice(i, 1)
    }
    //列表切换change()
    $scope.change = function (selected, i) {
        $scope.nowPlay = {
            songName: selected.songName,
            singer: selected.singer,
            url: selected.url,
            cover: selected.cover
        }
        $scope.nowPlayNum = {
            num: i + 1,
            length: $scope.songList.length
        }
        function PrefixInteger(num) {
            if (num < 10) {
                return '0' + num
            } else {
                return num
            }
        }
        oprogressCircle.style.left = 0 + 'px';
        clearInterval(timer);
        timer = setInterval(function () {
            var minuteNum = PrefixInteger(parseInt((audioControl.duration - audioControl.currentTime) / 60), 2);
            var secondNum = PrefixInteger(parseInt((audioControl.duration - audioControl.currentTime) % 60), 2);
            oprogressLight.style.width = audioControl.currentTime / audioControl.duration * 550 + 'px';
            oprogressCircle.style.left = audioControl.currentTime / audioControl.duration * 550 + 'px';
        }, 1000);
        $scope.listNum = $scope.nowPlayNum.num + '/' + $scope.songList.length
    }
    //播放与暂停playPause
    $scope.isPlay = true;
    $scope.playPause = function () {
        $scope.isPlay = !$scope.isPlay
        if ($scope.isPlay) {
            audioControl.pause();
        } else {
            audioControl.play();
        }
    }
    //上一曲下一曲
    $scope.lastSong = function () {
        var thisNum = $scope.nowPlayNum.num + 1;
        $scope.nowPlay = {
            songName: $scope.songList[thisNum - 1].songName,
            singer: $scope.songList[thisNum - 1].singer,
            url: $scope.songList[thisNum - 1].url,
            cover: $scope.songList[thisNum - 1].cover
        }
        $scope.listNum = $scope.nowPlayNum.num + '/' + $scope.songList.length
    }
    $scope.nextSong = function () {
        var thisNum = $scope.nowPlayNum.num + 1;
        var randomNum = Math.floor(Math.random() * $scope.songList.length);
        thisNum--
        if ($scope.isRandom === false) {
            $scope.nowPlay = {
                songName: $scope.songList[thisNum].songName,
                singer: $scope.songList[thisNum].singer,
                url: $scope.songList[thisNum].url,
                cover: $scope.songList[thisNum].cover
            }
        } else {
            $scope.nowPlay = {
                songName: $scope.songList[randomNum].songName,
                singer: $scope.songList[randomNum].singer,
                url: $scope.songList[randomNum].url,
                cover: $scope.songList[randomNum].cover
            }
        }
        $scope.listNum = $scope.nowPlayNum.num + '/' + $scope.songList.length
    }
    //进度条
    var oprogressCircle = document.getElementsByClassName('progressCircle')[0];
    var oprogressLight = document.getElementsByClassName('progressLight')[0];
    var oProgressBra = document.getElementsByClassName('progressBar')[0];
    oprogressCircle.onmousedown = function (e, $scope) {
        //$scope.playPause();
        var barLeft = oProgressBra.getBoundingClientRect().left;
        var circleLeft = e.clientX - oprogressCircle.getBoundingClientRect().left;
        var that = this;
        document.onmousemove = function (e) {
            //$scope.playPause();
            var CircleX = e.clientX - circleLeft - barLeft;
            audioControl.play();
            document.body.style.cursor = 'pointer';
            if (CircleX < 0) {
                CircleX = 0;
            } else if (CircleX > 550) {
                CircleX = 550;
            }
            that.style.left = CircleX + 'px';
            audioControl.currentTime = CircleX / 550 * audioControl.duration;
            oprogressLight.style.width = CircleX + 'px';
            var minuteNum = PrefixInteger(parseInt((audioControl.duration - audioControl.currentTime) / 60), 2);
            var secondNum = PrefixInteger(parseInt((audioControl.duration - audioControl.currentTime) % 60), 2);
        };
        document.onmouseup = function () {
            //$scope.playPause();
            document.onmousemove = null;
            audioControl.play();
        };
    };
    //随机播放
    $scope.isRandom = false;
    $scope.random = function () {
        $scope.isRandom = !$scope.isRandom;
    }
    /*$scope.nowSrc = $scope.nowPlay.url;
    $scope.$watch($scope.nowSrc, function () {
        console.log($scope.nowSrc)
        //play
        audioControl.play();
        //changeIcon
        $scope.playPause();
        //timeUpdate
        function PrefixInteger(num) {
            if (num < 10) {
                return '0' + num
            } else {
                return num
            }
        }
        oprogressCircle.style.left = 0 + 'px';
        clearInterval(timer);
        timer = $interval(function () {
            var minuteNum = PrefixInteger(parseInt((audioControl.duration - audioControl.currentTime) / 60), 2);
            var secondNum = PrefixInteger(parseInt((audioControl.duration - audioControl.currentTime) % 60), 2);
            $scope.musicTime = '-' + minuteNum + ':' + secondNum;
            oprogressLight.style.width = audioControl.currentTime / audioControl.duration * 550 + 'px';
            oprogressCircle.style.left = audioControl.currentTime / audioControl.duration * 550 + 'px';
        }, 1000);
    })*/

})


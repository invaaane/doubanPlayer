//更新进度条
function updateProgressBar() {
    console.log($('audio').attr('src'), $('audio')[0].duration, $('audio')[0].currentTime)
    let minuteNum = PrefixInteger(parseInt(($('audio')[0].duration - $('audio')[0].currentTime) / 60), 2);
    let secondNum = PrefixInteger(parseInt(($('audio')[0].duration - $('audio')[0].currentTime) % 60), 2);
    $('.musicTime').text('-' + minuteNum + ':' + secondNum);
    oprogressLight.style.width = $('audio')[0].currentTime / $('audio')[0].duration * 550 + 'px';
    oprogressCircle.style.left = $('audio')[0].currentTime / $('audio')[0].duration * 550 + 'px';
}
//更新列表数目
function updateListNum() {
    //此处有bug//在第一次点击删除按钮时，$("table tr").length不会改变
    $('.header_1 >span:first').html($('tr[class=activeRow]').index() + 1 + '/' + $(".table tr").length);
}
//点击列表更新音源区
function updateMessage(clickElement, songNum) {
    console.log(clickElement)
    $('.songTitle').html(songList[songNum].song);
    $('.singer').html(songList[songNum].singer);
    $('audio').attr('src', songList[songNum].url);
    $('audio')[0].play();
    changeIconToPause();
}
//时间加‘0’
function PrefixInteger(num) {
    if (num < 10) {
        return '0' + num
    } else {
        return num
    }
}
//随机播放
function rondomMode() {
    let a = Math.floor(Math.random() * $(".table tr").length);
    let b = $('.table tr[class=activeRow]').index() + 1;
    console.log(a,b)
    if (a === b) {
         a = Math.floor(Math.random() * $(".table tr").length);
    }
        $('.table tr:eq(' + a + ')').children(2).trigger('click');
}

/*---------滚动条----------*/
(function ($) {
    //滚动条
    $(window).load(function () {
        $(".content").mCustomScrollbar({
            scrollButtons: {
                enable: true
            }
        });

        function onTotalScrollBackCallback() {
            $(".callback_demo .callback_demo_output").html("<em>Scrolled to top. Content top position: " + mcs.top + "</em>").children("em").delay(1000).fadeOut("slow");
        }
        $(".callback_demo a[rel='scrollto-bottom']").click(function (e) {
            e.preventDefault();
            $(".content_8").mCustomScrollbar("scrollTo", "bottom");
        });
    });
})(jQuery);

//加载时自动播放
/*$(document).ready(function () {
    loadListData(); //加载歌曲列表
    $('tr:nth-child(1)>td:nth-child(2)').trigger('click');
});*/

//播放完毕自动下一首
$(document).find('audio').on('ended', function () {
    $('.icon-double-angle-left').trigger('click');
});


/*---------列表区----------*/
//点击列表歌名
var timer = null;
$(document).on('click', '.table tr>td:nth-child(2),.table tr>td:nth-child(3)', function () {
    changeIconToPause();
    var songNum = $(this).parent().parent().find("tr").index($(this).parent()[0])
    updateMessage($(this).parent(), songNum);
    $('tr').removeClass('activeRow');
    $(this).parent().addClass('activeRow'); //正在播放高亮
    updateListNum(); //更新列表数目
    oprogressCircle.style.left = 0 + 'px';
    clearInterval(timer);
    timer = setInterval('updateProgressBar() ', 1000);
});

//搜索歌名并添加至列表
var songname = '';
var songList = [];
var songSuggest = []
var td1 = '<i class="icon-heart-empty controlLove"></i>';
var td4 = '<div class="hiddendiv"><i class="icon-twitter signhidden"></i><i class="icon-facebook signhidden"></i></div><i class="icon-share"></i><i class="icon-remove icon_right"></i>'
$(document).on('click', function () {
    $('#search-suggest').hide();
})
//搜索时按键判断与下拉层显示
$('.searchInput').on('keyup', function (e) {
    songname = $('.searchInput').val();
    if (e.keyCode == 13) {
        //console.log( $('.searchValue input').val())
        search()
    } else {
        $('#search-suggest').show().css({
            top: $('.search-form').offset().top + $('.searchInput').height(),
            left: $('.search-form').offset().left,
            position: "absolute",
        })
        songSuggest.splice(0, 9);
        $.get('http://route.showapi.com/213-1?showapi_appid=42474&showapi_sign=492eb17362f84ed9b5bd7951f64fa5ee&keyword=' + songname, function (data) {
            var html = '';
            for (var i = 0; i < 10; i++) {
                songSuggest.push({
                    song: data.showapi_res_body.pagebean.contentlist[i].songname,
                    singer: data.showapi_res_body.pagebean.contentlist[i].singername,
                    url: data.showapi_res_body.pagebean.contentlist[i].m4a,
                    img: data.showapi_res_body.pagebean.contentlist[i].albumpic_big
                })
                html += '<li><table><tr><td>' + data.showapi_res_body.pagebean.contentlist[i].songname + '</td><td>' + data.showapi_res_body.pagebean.contentlist[i].singername + '</td></tr></table></li>';
            }
            $('#searchResult').html(html);
        })
    }
})
//点击下拉层添加至列表并播放
$('#search-suggest').on('click', 'li', function () {
    console.log("1")
    var suggestNum = $(this).index();
    $('.table').prepend($('<tr/>')
        .append($('<td/>').html(td1))
        .append($('<td/>').html(songSuggest[suggestNum].song))
        .append($('<td/>').html(songSuggest[suggestNum].singer))
        .append($('<td/>').html(td4)));
    songList.unshift({
        song: songSuggest[suggestNum].song,
        singer: songSuggest[suggestNum].singer,
        url: songSuggest[suggestNum].url,
        img: songSuggest[suggestNum].img
    })
    console.log(songList)
    $('audio').attr('src', songSuggest[suggestNum].url);
    $('img').attr('src', songSuggest[suggestNum].img);
    $('.songTitle').html(songSuggest[suggestNum].song);
    $('.singer').html(songSuggest[suggestNum].singer);
    $('audio')[0].play();
    $('.table').find('tr').removeClass('activeRow').
        eq(0).addClass('activeRow'); //正在播放高亮
    updateListNum();
    changeIconToPause();
    songSuggest.splice(0, 9);
    clearInterval(timer);
    timer = setInterval('updateProgressBar() ', 1000);
})
//点击放大镜搜索
$('#searchButton').on('click', function () {
    songname = $('.searchInput').val();
    search()
})
function search() {
    $.ajax({
        url: 'http://route.showapi.com/213-1?showapi_appid=42474&showapi_sign=492eb17362f84ed9b5bd7951f64fa5ee&keyword=' + songname,
        type: 'get',
        cache: false,
        dataType: 'json',
        success: function (data) {
            songList.unshift({
                song: data.showapi_res_body.pagebean.contentlist[0].songname,
                singer: data.showapi_res_body.pagebean.contentlist[0].singername,
                url: data.showapi_res_body.pagebean.contentlist[0].m4a,
                img: data.showapi_res_body.pagebean.contentlist[0].albumpic_big
            })
            console.log(songList)
            console.log(data, data.showapi_res_body.pagebean.contentlist[0].albumpic_small)
            //$('#message-cover img').css('background-image','url('+data.showapi_res_body.pagebean.contentlist[0].albumpic_big+')')
            $('.table').prepend($('<tr/>')
                .append($('<td/>').html(td1))
                .append($('<td/>').html(data.showapi_res_body.pagebean.contentlist[0].songname))
                .append($('<td/>').html(data.showapi_res_body.pagebean.contentlist[0].singername))
                .append($('<td/>').html(td4)));
            //console.log(songList, songList[songList.length - 1])
            $('audio').attr('src', data.showapi_res_body.pagebean.contentlist[0].m4a);
            $('img').attr('src', data.showapi_res_body.pagebean.contentlist[0].albumpic_big);
            $('audio')[0].play();
            $('.singer').html(data.showapi_res_body.pagebean.contentlist[0].singername);
            $('.songTitle').html(data.showapi_res_body.pagebean.contentlist[0].songname);
            $('.table').find('tr').removeClass('activeRow').eq(0).addClass('activeRow'); //正在播放高亮
            changeIconToPause();
            updateListNum();
            clearInterval(timer);
            timer = setInterval('updateProgressBar() ', 1000);
        },
        error: function () {
            // view("异常！");  
            alert("异常！");
        }
    });
}

//清空全部
$('.clearAll').on('click', function () {
    $("tr").each(function () {
        $(this).remove();
        updateListNum();
        $('audio').attr('src', '');
        $('img').attr('src', 'img/cover.jpg');
        $('.singer').text('');
        changeIconToPlay();
    });
    $('.wrap1').append("<div class='clearPrompt'><p>没有播放的歌曲了，去<a href='https://music.douban.com/artists/'>这里</a>看看有没有想听的吧</p></div>");
});


/*---------按钮区----------*/
//切换图标play-pause
function changeIconToPause() {
    if ($('.control-play').hasClass('icon-play')) {
        $('.control-play').attr('class', 'icon-pause control-play icon-2x');
    }
}
//切换图标pause-play
function changeIconToPlay() {
    if ($('.control-play').hasClass('icon-pause')) {
        $('.control-play').attr('class', 'icon-play control-play icon-2x');
    }
}
//暂停播放
$('.control-play').on('click', function () {
    //console.log(this)
    $(this).toggleClass("icon-pause icon-play");
    if ($(this).hasClass('icon-pause')) {
        $('audio')[0].play();
        timer = setInterval('updateProgressBar()', 1000);
    } else {
        $('audio')[0].pause();
        clearInterval(timer);
    }
});
//上一曲下一曲，模拟列表被点击
$('.icon-double-angle-left').on('click', function () {
    //console.log("1")
    if ($('.exchangeMode').hasClass('icon-reorder')) {
        $('.table tr[class=activeRow]').prev().children(2).trigger('click');
    } else {
        rondomMode();
    }
});
$('.icon-double-angle-right').on('click', function () {
    console.log("1")
    if ($('.exchangeMode').hasClass('icon-reorder')) {
        $('.table tr[class=activeRow]').next().children(2).trigger('click');
    } else {
        rondomMode();
        console.log("2")
    }
});
//随机播放/顺序播放
$('.exchangeMode').on('click', function () {
    $(this).toggleClass("icon-reorder icon-random");
});
//喜欢/不喜欢
$(document).on('click', '.controlLove', function () {
    $(this).toggleClass("icon-heart-empty icon-heart");
});
//静音
$('.volume').on('click', function () {
    $(this).toggleClass("icon-volume-up icon-volume-off");
    if ($(this).hasClass('icon-volume-up')) {
        $('audio')[0].volume = 1;
    } else {
        $('audio')[0].volume = 0;
    }
});
//分享
$(document).on('mouseenter', '.icon-share', function () {
    $(this).siblings('div').css('display', 'inline-block');
});
$(document).on('mouseleave', 'tr>td:nth-child(4)', function () {
    $(this).find('.hiddendiv').css('display', 'none');
});
//删除,模拟下一首被点击
$(document).on('click', '.icon-remove', function () {
    //thistrn
    //$(this).parent().parent(). 
    $(this).parent().parent().fadeTo("200", 0.1, function () {
        if ($(this).hasClass('activeRow')) { //此处this已指向tr
            $('.icon-double-angle-right').trigger('click')
        }
        var songNum = $(this).index();
        songList.splice(songNum, 1);
        $(this).remove();
        //console.log(songNum,songList)
        updateListNum();
    });
});

/*---------进度条部分由原生js编写----------*/
var oprogressCircle = document.getElementsByClassName('progressCircle')[0];
var oprogressLight = document.getElementsByClassName('progressLight')[0];
var oProgressBra = document.getElementsByClassName('progressBar')[0];
//进度条，拖拽时停止播放
oprogressCircle.onmousedown = function (event) {
    changeIconToPlay();
    e = event || window.event;
    let b = oProgressBra.getBoundingClientRect().left;
    let x2 = e.clientX - oprogressCircle.getBoundingClientRect().left;
    let that = this;
    document.onmousemove = function (event) {
        changeIconToPlay();
        e = event || window.event;
        let CircleX = e.clientX - x2 - b;
        $('audio')[0].pause();
        document.body.style.cursor = 'pointer';
        if (CircleX < 0) {
            CircleX = 0;
        } else if (CircleX > 550) {
            CircleX = 550;
        }
        that.style.left = CircleX + 'px';
        $('audio')[0].currentTime = CircleX / 550 * $('audio')[0].duration;
        oprogressLight.style.width = CircleX + 'px';
        let minuteNum = PrefixInteger(parseInt(($('audio')[0].duration - $('audio')[0].currentTime) / 60), 2);
        let secondNum = PrefixInteger(parseInt(($('audio')[0].duration - $('audio')[0].currentTime) % 60), 2);
        $('.musicTime').text(minuteNum + ':' + secondNum);
    };
    document.onmouseup = function () {
        changeIconToPause();
        document.onmousemove = null;
        $('audio')[0].play();
    };
};
//点击进度条
oProgressBra.onclick = function (event) {
    e = event || window.event;
    let a = e.clientX - oProgressBra.getBoundingClientRect().left;
    $('audio')[0].currentTime = a / 550 * $('audio')[0].duration;
    let minuteNum = PrefixInteger(parseInt(($('audio')[0].duration - $('audio')[0].currentTime) / 60), 2);
    let secondNum = PrefixInteger(parseInt(($('audio')[0].duration - $('audio')[0].currentTime) % 60), 2);
    $('.musicTime').text('-' + minuteNum + ':' + secondNum);
    oprogressLight.style.width = a + 'px';
    oprogressCircle.style.left = a + 'px';
};



/*---------注册页----------*/
/*$(document).on('click', '.register', function () {
    $('.registration-page, .cover').css('display', 'block');
})
$(document).on('click', '.icon-reply', function () {
    $('.registration-page, .cover').css('display', 'none');
})
// angularJS
angular.module('myApp', [])
    .controller('signUpController', function ($scope) {
        $scope.userdata = {};
        $scope.submitForm = function () {
            console.log($scope.userdata);
        }
    })
    .directive('compare', function () {
        var o = {};
        o.strict = 'AE';
        o.scope = {
            orgText: '=compare'
        };
        o.require = 'ngModel';
        o.link = function (sco, ele, att, con) {
            con.$validators.compare = function (v) {
                return v == sco.orgText;
            };
            sco.$watch('orgText', function () {
                con.$validate();
            })
        };
        return o;
    });*/
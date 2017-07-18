/*---------调用函数----------*/
function loadListData() {
    let data = [{
        song: '我的心里没有他(Live)',
        songer: '张国荣'
        }, {
        song: '我的心里没有他(Live)',
        songer: '张国荣'
        }, {
        song: '我的心里没有他(Live)',
        songer: '张国荣'
        }, {
        song: '我的心里没有他(Live)',
        songer: '张国荣'
        }, {
        song: '我的心里没有他(Live)',
        songer: '张国荣'
        }, {
        song: '我的心里没有他(Live)',
        songer: '张国荣'
        }, {
        song: '1963 (Acoustic)',
        songer: 'Rachael Yamagata'
        }, {
        song: 'Die Internationale',
        songer: 'Hannes Wader'
        }, {
        song: 'Little Green Bag',
        songer: 'George Baker Selection'
        }, {
        song: 'Our Window',
        songer: 'Noah and the Whale'
        }, {
        song: '川べりの家',
        songer: '松绮名央'
        }, {
        song: '我的心里没有他(Live)',
        songer: '张国荣'
        }, {
        song: '告白气球',
        songer: ''
        }];
    let td1 = '<i class="icon-heart-empty controlLove"></i>';
    let td4 = '<div class="hiddendiv"><i class="icon-twitter signhidden"></i><i class="icon-facebook signhidden"></i></div><i class="icon-share"></i><i class="icon-remove icon_right"></i>'
    $.each(data, function (index, el) {
        console.log(index,el)
        $(".table").prepend($('<tr/>')
            .append($('<td/>').html(td1))
            .append($('<td/>').html(el.song))
            .append($('<td/>').html(el.songer))
            .append($('<td/>').html(td4)));
    });
}
//更新进度条
function updateProgressBar() {
    let minuteNum = PrefixInteger(parseInt(($('audio')[0].duration - $('audio')[0].currentTime) / 60), 2);
    let secondNum = PrefixInteger(parseInt(($('audio')[0].duration - $('audio')[0].currentTime) % 60), 2);
    $('.musicTime').text('-' + minuteNum + ':' + secondNum);
    oprogressLight.style.width = $('audio')[0].currentTime / $('audio')[0].duration * 550 + 'px';
    oprogressCircle.style.left = $('audio')[0].currentTime / $('audio')[0].duration * 550 + 'px';
}
//更新列表数目
function updateListNum() {
    //此处有bug//在第一次点击删除按钮时，$("table tr").length不会改变
    $('.header_1 >span:first').html($('tr[class=activeRow]').index() + 1 + '/' + $("table tr").length);
}
//更新信息区
function updateMessage(clickElement) {
    console.log(clickElement)
    $('.songTitle').html(clickElement.find('td').eq(1).text());
    $('.singer').html(clickElement.find('td').eq(2).text());
    $('audio').attr('src', 'mp3/' + clickElement.find('td').eq(1).text() + '.mp3');
    $('audio')[0].play();
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
    let a = Math.floor(Math.random() * $("table tr").length);
    let b = $('tr[class=activeRow]').index() + 1;
    if (a === b) {
        let a = Math.floor(Math.random() * $("table tr").length);
    } else {
        $('tr:eq(' + a + ')').children(2).trigger('click');
    }
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
$(document).ready(function () {
    loadListData(); //加载歌曲列表
    $('tr:nth-child(1)>td:nth-child(2)').trigger('click');
});

//播放完毕自动下一首
$(document).find('audio').on('ended', function () {
    $('.icon-double-angle-left').trigger('click');
});


/*---------列表区----------*/
//点击歌名
var timer = null;
$(document).on('click', 'tr>td:nth-child(2),tr>td:nth-child(3)', function () {
    //alert('1')
    $('tr').removeClass('activeRow');
    $(this).parent().addClass('activeRow'); //正在播放高亮
    updateListNum(); //更新列表数目
    oprogressCircle.style.left = 0 + 'px';
    updateMessage($(this).parent());
    clearInterval(timer);
    timer = setInterval('updateProgressBar() ', 1000);
});
//清空全部
$('.clearAll').on('click', function () {
    $("tr").each(function () {
        $(this).remove();
        updateListNum();
    });
    $('.wrap1').append("<div class='clearPrompt'><p>没有播放的歌曲了，去<a href='https://music.douban.com/artists/'>这里</a>看看有没有想听的吧</p></div>");
});


/*---------按钮区----------*/
//暂停播放
$('.control-play').on('click', function () {
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
    if ($('.exchangeMode').hasClass('icon-reorder')) {
        $('tr[class=activeRow]').prev().children(2).trigger('click');
    } else {
        rondomMode();
    }
});
$('.icon-double-angle-right').on('click', function () {
    if ($('.exchangeMode').hasClass('icon-reorder')) {
        $('tr[class=activeRow]').next().children(2).trigger('click');
    } else {
        rondomMode();
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
    $(this).parent().parent().fadeTo("200", 0.1, function () {
        if ($(this).hasClass('activeRow')) { //此处this已指向tr
            $('.icon-double-angle-right').trigger('click')
        }
        $(this).remove();
        updateListNum();
    });
});

//请求返回
function databack(songname){
    console.log('1')
    $.ajax({  
     url:'http://route.showapi.com/213-1?showapi_appid=41357&showapi_sign=a0d8d112009e42b3b37e8585c1070360&keyword='+songname,   
     type:'get',  
     cache:false,  
     dataType:'json',  
     success:function(data) {  
         console.log(data,data.showapi_res_body.pagebean.contentlist[0].m4a)
         $('audio').attr('src', data.showapi_res_body.pagebean.contentlist[0].m4a);         
      },  
      error : function() {  
           // view("异常！");  
           alert("异常！");  
      }  
 });
}
/*---------进度条部分由原生js编写----------*/
let oprogressCircle = document.getElementsByClassName('progressCircle')[0];
let oprogressLight = document.getElementsByClassName('progressLight')[0];
var oProgressBra = document.getElementsByClassName('progressBar')[0];
//进度条，拖拽时停止播放
oprogressCircle.onmousedown = function (event) {
    e = event || window.event;
    let b = oProgressBra.getBoundingClientRect().left;
    let x2 = e.clientX - oprogressCircle.getBoundingClientRect().left;
    let that = this;
    document.onmousemove = function (event) {
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
//请求返回


/*---------注册页----------*/
$(document).on('click', '.register', function () {
    $('.registration-page, .cover').css('display', 'block');
})
$(document).on('click', '.icon-reply', function () {
    $('.registration-page, .cover').css('display', 'none');
})
// angularJS
angular.module('myApp', [])
    .controller('signUpController', function ($scope) {
        $scope.userdata = {};
        /*$scope.testData={
            'name':'1'
        }*/
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
    });



//原想做一个切换图标的重用函数，后来因为迟迟找不到如何向元素赋值变量class的正确方法，所幸想起toggleclass；
//得空应该找找toggleclass的源码看一下，应该会有体现
/*
  function changeIcon(publicname, firstname, secondname) {
        if ($('.' + publicname).hasClass(firstname)) {
            $(this).className = '+publicname+' + '  ' + '+secondname x        } else {
            this.className = '+publicname+' + '  ' + '+firstname+';
        }
    }
*/

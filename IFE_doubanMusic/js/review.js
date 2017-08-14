function searchFirstAdd() {
    $.ajax({
        url: 'http://route.showapi.com/213-1?showapi_appid=42474&showapi_sign=492eb17362f84ed9b5bd7951f64fa5ee&keyword=' + songName,
        success: function (data) {
            songList.unshift({
                songName: data.showapi_res_body.pagebean.contentlist[0].songname,
                singer: data.showapi_res_body.pagebean.contentlist[0].singer,
                cover: data.showapi_res_body.pagebean.contentlist[0].albumpic_big,
                url: data.showapi_res_body.pagebean.contentlist[0].mp4
            })
            $('.table').prepend($('<tr/>')
                .append($('<td/>').html(td1))
                .append($('<td/>').html(data.showapi_res_body.pagebean.contentlist[0].songName))
                .append($('<td/>').html(data.showapi_res_body.pagebean.contentlist[0].singer))
                .append($('<td/>').html(td4)));
            $('.table').find('tr').removeClass('activeRow').eq(0).addClass('activeRow');
            $('.audio').attr('src', data.showapi_res_body.pagebean.contentlist[0].mp4).play();
            $('.cover').attr('src', data.showapi_res_body.pagebean.contentlist[0].albumpic_big);
            $('.songName').html(data.showapi_res_body.pagebean.contentlist[0].songname);
            $('.singer').html(data.showapi_res_body.pagebean.contentlist[0].singer);
            changeIconToPause();
            updateListNum();
            clearInterval(timer);
            timer = setInterval('updateProgressbar', 1000);
        },
        error: function () {
            alert('error');
        }
    })
}
//进度条实现
var onProgressCircle = document.getElementsByClassName('progressCircle');
var onProgressLight = document.getElementsByClassName('progressLight');
var onProgressBar = document.getElementsByClassName('progressBar');
onProgressCircle.onmousedown = function (event) {
    console.log(1)
    var barLeft = onProgressbar.getBoundingClientRect().left;
    var circleWidth = event.clientX - onProgressCircle.getBoundingClientRect().left;
    var that = this;
    onProgressCircle.onmousemove = function (event) {
        that.style.left = event.clientX - circleWidth + 'px';
        onProgressLight.style.left = event.clientX - barLeft - circleWidth + 'px';
    }
}
onProgressBar.onmousedown = function (event) {
    var barLeft = onProgressbar.getBoundingClientRect().left;
    var circleWidth = event.clientX - onProgressCircle.getBoundingClientRect().left;

}
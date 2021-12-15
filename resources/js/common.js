function AddComma(data_value) {
    return Number(data_value).toLocaleString('en').split(".")[0];    
}

var isMain = false;

function initHeaderMenu(){
    //alert(isMain);
    if(isMain){
        $(".icon-back").hide();
        $("h1").addClass("main-logo");
        $("h1").append("STOCK<span class='color-orange'>Z</span>INE");
    } else{
        var h3Title = $(".h3_title").text();
        $("h1").hide();
        $("h1").text(h3Title);

        $(window).scroll(function(){
            // console.log($(document.body).scrollTop());
            var height = $(window).scrollTop();
        
            if(height < 50){
                $("h1").hide();
                // console.log('up');
            } else{
                $("h1").fadeIn();
                // console.log('down');
            }
        });
    }
}

function findDocbarIndex(){
    if( $("#dock").hasClass("doc_main") ){
        return 0;
    }else if( $("#dock").hasClass("doc_subscribe") ){
        return 1;
    }else if( $("#dock").hasClass("doc_ranking") ){
        return 2;
    }else if( $("#dock").hasClass("doc_like") ){
        return 3;
    }else if( $("#dock").hasClass("doc_notice") ){
        return 4;
    }
    //return false;
}

function getToday(){
    var getYear = new Date().getFullYear();
    var getMonth = new Date().getMonth()+1;
    var getDay = new Date().getDate();
    var returnDate = "";
    getMonth = (String(getMonth).length < 2) ? "0"+getMonth : getMonth;
    returnDate = getYear+"-"+getMonth+"-"+getDay;
    return returnDate;
}

function docbarSet(){
    var docbarIdx = findDocbarIndex();
    $("#dock").find("li > a").removeClass("on");
    if(docbarIdx >= 0){
        $("#dock").find("li").eq(docbarIdx).children("a").addClass("on");
    }else{
        //$("#dock").find("li").eq(0).children("a").addClass("on");
    }

}

function getWeekName(dateString) {
    var dateStr = (dateString) ? dateString : null;
    var week = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
    
    var today = new Date(dateStr).getDay();
    var todayLabel = week[today];
    
    return todayLabel;
}

function getShotDate(dateString) {
    function zeroCheck(str){
        var re_str = str.split("");
        if(re_str[0] == "0"){
            return re_str[1];
        }else{
            return str;
        }
    }
    var shotDateString = "";
    var dateStr = dateString.split("-");
    var monStr = zeroCheck(dateStr[1]);
    var dayStr = zeroCheck(dateStr[2]);
    shotDateString = monStr+"."+dayStr;
    
    return shotDateString;
}

function logout(email){
    $.ajax({
        url: 'https://stockzine.co.kr/api/user/logout',
        dataType: 'json',
        type: 'POST',
        data: {'email':email},
        success: function(result) {
            if (result) {
                location.href="/app/user/logout";
            }else{

            }
       }
    });
    return false;
}

function emailCheck(email, type, callback){
    showLodingPageView(true);
    $.ajax({
        url: 'https://stockzine.co.kr/api/user/email_certified',
        dataType: 'json',
        type: 'POST',
        data: {'email':email, 'type':type},
        success: function(result) {
            if (result.success) {
                alert("입력하신 이메일로 인증번호가 발송되었습니다")
                showLodingPageView(false);
                callback();
            }else{
                alert(result.message)
                showLodingPageView(false);
            }
        },
        error: function(err) {
            alert(err);
            showLodingPageView(false);
        }
    });
}

function emailCertify(email, n, callback){
    showLodingPageView(true);
    $.ajax({
        url: 'https://stockzine.co.kr/api/user/email_certified_confirm',
        dataType: 'json',
        type: 'POST',
        data: {'email':email, 'num':n},
        success: function(result) {
            if (result) {
                alert("인증이 완료 되었습니다")
                showLodingPageView(false);
                callback();
            }else{
                alert(esult.message)
                showLodingPageView(false);
            }
        },
        error: function(err) {
            alert(err);
            showLodingPageView(false);
        }
    });
}

function getRanking(m, c, t, l){
    showLodingPageView(true);
    var getMonth = m;
    var getCate = c;
    var len = (l) ? l : 10;
    $.ajax({
        url: 'https://stockzine.co.kr/app/ranking/get_ranking',
        dataType: 'json',
        type: 'POST',
        data: {'getM':getMonth, 'getC':getCate, 'len':len},
        success: function(result) {
            if (result) {
                var list =  result;
                var dom = "";
            
                if(c == "step1"){
                    prdCodeNum = "000010";
                }else if(c == "step2"){
                    prdCodeNum = "000020";
                }else if(c == "step3"){
                    prdCodeNum = "000030";
                }

                for( var i = 0; i<list.length; i++){

                    var maxP = AddComma(list[i].max_price);
                    var baseP = AddComma(list[i].base_price);
                    var grow_mark = (Number(list[i].max_price) > Number(list[i].base_price)) ? "▲" : "▼";
                    var c_class = (Number(list[i].max_price) > Number(list[i].base_price)) ? "gap_up" : "gap_down";

                    dom +='<a class="highlight-cont" href="/app/subscribe/item_list?prd='+prdCodeNum+'&date='+list[i].date+'&prdCode='+list[i].code+'">';
                    dom +='<div class="ranking-wrap">';
                    dom +='<div class="rank">';
                    dom +=' <div class="rank-txt">BEST</div>';
                    dom +='<div class="rank-num">'+(i+1)+'</div>';
                    dom +='</div>';

                    dom +='<div class="product-rank-cont">';
                    dom +='<div class="product-name">';
                    dom +='<div class="product-name-left">';
                    dom +='<span class="product-title">'+list[i].name+'</span><span class="product-num">'+list[i].code+'</span>';
                    dom +='</div>';
                    dom +='</div>';
                            
                    dom +='<div class="product-rank-detail">';
                    dom +='<ul class="product-table">';
                    dom +='<li class="request">';
                    dom +='<div class="product-title">발굴가 <span class="product-date">'+list[i].date+'</span></div>';
                    dom +='<div class="product-price">'+baseP+'</div>';
                    dom +='<div class="product-percent">'+list[i].search_per+'%</div>';
                    dom +='</li>';
                    dom +='<li class="max">';
                    dom +='<div class="product-title">최고가 <span class="product-date">'+list[i].max_date+'</span></div>';
                    dom +='<div class="product-price '+c_class+'">'+maxP+'</div>';
                    dom +='<div class="product-percent '+c_class+'"><span class="gap">'+grow_mark+'</span>'+list[i].max_per+'%</div>     ';                                   
                    dom +='</li>';
                    dom +='</ul>';
                    dom +='</div>';
                    dom +='</div>';
                    dom +='</div>';                      
                    dom +='</a>';

                }
                showLodingPageView(false);
                $("#"+t+"").empty().append(dom);
                
                // 하이라이트
                $('.highlight-cont:nth-child(1), .highlight-cont:nth-child(2), .highlight-cont:nth-child(3)').addClass('high-rank');
            }else{
                console.log("랭킹 데이터 접근에 실패하였습니다.")
            }
       }
    });
    return false;
}

function showLayerPopup(url, title){

    var dom = "";
    dom += "<div class='layer_pop'>";
    dom += "<div class='layer_head'>";
    dom += "<h2>"+title+"</h2>";
    dom += "<a href='#' class='pop_close'>X</a>";
    dom += "</div>";   
    dom += "<div class='layer_pop_cont'>";
    dom += "<iframe src='"+url+"' id='talkIframe'>";
    dom += "</div>";
    dom += "</div>";

    var winOT = $(window).scrollTop();
    var winW = $(window).innerWidth();
    var winH = $(window).innerHeight();

    
    $("body").append(dom);
    $(".layer_pop").css({"top":(winH)+"px"});
    $(".layer_pop").find("iframe").css({"height":(winH-56)+"px"});
    
    $(".layer_pop").animate({"top":"0px"}, 500, function(){
        $(".layer_pop").find(".pop_close").on("click", function(){
            $(window).scrollTop(winOT);
            $(".layer_pop").animate({"top":(winH)+"px"}, 500, function(){
                $("body").find(".layer_pop").remove();
            })
            return false;
        })

    });
}

function showPopupChart(code){
    var req_url = "https://m.stock.naver.com/item/main.nhn#/stocks/"+code+"/total";
    showLayerPopup(req_url, code);
}


function moveMonth(code, year, month){
    console.log(code+","+year+","+month);
    if(month === "" && year === ""){
        alert('현재가 마지막 달입니다.');
        return false;
    }else{
        location.href="/app/subscribe/daily_list?prd="+code+"&month="+month+"&year="+year;
    }
}

function showLodingPageView(f){
    if(f){
        var h = $(window).outerHeight();
        $("body").append("<div class='loading_dim' style='height:"+h+"px'></div><div class='loading_view' style='height:"+h+"px'></div>")
    }else{
        $("body").children(".loading_dim").remove();
        $("body").children(".loading_view").remove();
    }
}

$(window).resize(function(){
    var h = $(window).outerHeight();
    $("body").children(".loading_dim").css({"height":h+"px"});
    $("body").children(".loading_view").css({"height":h+"px"});
})



$(document).ready(function(){
    initHeaderMenu();//헤더 메뉴 or 뒤로가기 셋팅
    $(".icon-back").on("click", function(){
        history.back();
    });

    $(".icon-menu").on("click", function(){
        $("body").append("<div class='dimmed'></div>");
        $("#mySidenav").stop().animate({right:"0"}, 0);
        return false;
    });
    
    $(document).on("click",".navi-close, .dimmed", function(){
        $("#mySidenav").stop().animate({right:"-82%"}, 0).queue(function(){
            $(".dimmed").fadeOut("slow").remove();
        })
    });
    docbarSet();


    // $(document).click(function(e) { 
    //     if(!$(e.target).is(".sidenav")) { 
    //         $("#mySidenav").stop().animate({right:"-82%"}, 0).queue(function(){
    //             $(".dimmed").fadeOut("slow").remove();
    //         })
    //     } 
    // });


    $(document).on('click', 'a[href="#"]', function(e){
        e.preventDefault();
    });

    $(document).on("click", ".icon-m-search", function(){
        $(".inp-search").toggle();
    })

    // Main Noti Close
    $(document).on("click", ".btn-noti-close", function(){
        $(".main-noti").slideUp("slow");
    })

    // Menu 활성화
    if(pageNum == "00.00"){
        $("li").removeClass("on");
        $("li.menu_home").addClass("on");
    }else if(pageNum == "01.00"){
        $("li").removeClass("on");
        $("li.menu_product").addClass("on");
    }else if(pageNum == "02.00"){
        $("li").removeClass("on");
        $("li.menu_subscribe").addClass("on");
    }else if(pageNum == "03.00"){
        // $("li").removeClass("on");
        // $("li.menu_ranking").addClass("on");
    }else if(pageNum == "04.00"){
        $("li").removeClass("on");
        $("li.menu_like").addClass("on");
    }else if(pageNum == "05.00"){
        $("li").removeClass("on");
        $("li.menu_notify").addClass("on");
    }else if(pageNum == "06.00"){
        $("li").removeClass("on");
        $("li.menu_mypage").addClass("on");
    }else if(pageNum == "07.00"){
        $("li").removeClass("on");
        $("li.menu_helpdesk").addClass("on");
    }
        



    // Tab Menu
    $('.tabmenu').find('li').bind('click', function(){
        var tabIdx = $('.tabmenu>li').eq(1);
        console.log(tabIdx);

        $except = $(this);
        console.log($except);
        $except.addClass('on');
        $('.tabmenu').find('li').not($except).removeClass('on');



        var indexNo = $(this).index();

        var selCont = $(".tab-cont-wrap>.tab-cont");
        var selTabCont = selCont.eq(indexNo);

        selTabCont.show();
        selCont.not(selTabCont).hide();

        // var tabIdx = findTabIndex();
        // // $("#dock").find("li").eq(tabIdx).children("a").addClass("on");
    })
    $(".tabmenu>li").eq(0).trigger("click");

    $('.tabmenu_list').find('li').bind('click', function(){
        var tabIdx = $('.tabmenu_list>li').eq(1);
        console.log(tabIdx);

        $except = $(this);
        console.log($except);
        $except.addClass('on');
        $('.tabmenu_list').find('li').not($except).removeClass('on');

        var indexNo = $(this).index();
        var selCont = $(".tab-cont-wrap>.tab-cont");
        var selTabCont = selCont.eq(indexNo);

        selTabCont.show();
        selCont.not(selTabCont).hide();
    })
    $(".tabmenu_list>li").eq(0).trigger("click");

})



// Global site tag (gtag.js) - Google Analytics
document.write('<script async src="https://www.googletagmanager.com/gtag/js?id=G-NTTYRV64XM"></script>');
document.write('<script>');
document.write('  window.dataLayer = window.dataLayer || [];');
document.write('  function gtag(){dataLayer.push(arguments);}');
document.write("  gtag('js', new Date());");
document.write("  gtag('config', 'G-NTTYRV64XM');");
document.write('</script>');
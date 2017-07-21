// ==UserScript==
// @name         OPR-INDEX-TOOLS
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       nancybaby233
// @match        https://opr.ingress.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @homepageURL  https://github.com/nancybaby002/OPR-INDEX-TOOLS
// @updateURL    https://raw.githubusercontent.com/nancybaby002/OPR-INDEX-TOOLS/master/opr.index.tools.CHN.js
// @downloadURL  https://raw.githubusercontent.com/nancybaby002/OPR-INDEX-TOOLS/master/opr.index.tools.CHN.js
// ==/UserScript==
(function() {
    'use strict';
    const totalCount=parseInt($(".gold")[0].innerText);
    const createCount=parseInt($(".gold")[1].innerText);
    const rejectCount=parseInt($(".gold")[2].innerText);
    const totalGet=createCount+rejectCount;
    var rate=((rejectCount+createCount)/totalCount*100).toFixed(2);
    $("#player_stats div").append('<br><p>'+
        '<span class="glyphicon glyphicon-info-sign ingress-gray pull-left" uib-tooltip-trigger="outsideclick" uib-tooltip-placement="left" tooltip-class="goldBorder" uib-tooltip="通过比例"></span>'+
        '<span style="margin-left: 5px" class="ingress-mid-blue pull-left">总通过数：</span>'+
        '<span class="gold pull-right">'+totalGet+'</span>'+
        '</p>');
    $("#player_stats div").append('<br><p>'+
        '<span class="glyphicon glyphicon-info-sign ingress-gray pull-left" uib-tooltip-trigger="outsideclick" uib-tooltip-placement="left" tooltip-class="goldBorder" uib-tooltip="通过比例"></span>'+
        '<span style="margin-left: 5px" class="ingress-mid-blue pull-left">通过比例：</span>'+
        '<span class="gold pull-right">'+rate+'%（'+totalGet+'/'+totalCount+'）</span>'+
        '</p>');
    //Bronze: 100
    //Silver: 750
    //Gold: 2500
    //Platinum: 5000
    //Onyx: 10000
    // 展示进度条
    function showProcessBar(){
        var barRate;
        var achieveName;
        var target;
        if(totalGet<100){
            target=100;
            barRate=totalGet/100*100;
            achieveName="铜";
        }else if(totalGet>=100&&totalGet<750){
            target=750;
            barRate=totalGet/750*100;
            achieveName="银";
        }else if(totalGet>=750&&totalGet<2500){
            target=2500;
            barRate=totalGet/2500*100;
            achieveName="金";
        }else if(totalGet>=2500&&totalGet<5000){
            target=5000;
            barRate=totalGet/5000*100;
            achieveName="钛";
        }else if(totalGet>=5000&&totalGet<10000){
            target=10000;
            barRate=totalGet/10000*100;
            achieveName="黑";
        }else{
            target=10000;
            barRate=100;
            achieveName="黑";

        }
        var process='<br><p>'+
            '<span class="glyphicon glyphicon-info-sign ingress-gray pull-left" uib-tooltip-trigger="outsideclick" uib-tooltip-placement="left" tooltip-class="goldBorder" uib-tooltip="按你评审结果而驳回的Portal数量"></span>'+
            '<span style="margin-left: 5px" class="ingress-mid-blue pull-left">开'+achieveName+'牌进度：</span>'+
            '<span class="gold pull-right">'+barRate+'%（'+totalGet+'/'+target+'）</span>'+
            '</p>';
        process=process+'<br><div class="progress progress-striped active"> <div class="progress-bar progress-bar-warning" role="progressbar"aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"style="width: '+barRate+'%;"> </div></div>';
        $("#player_stats div").append(process);
    }
    showProcessBar();


})();
// ==UserScript==
// @name         OPR-INDEX-TOOLS
// @namespace    http://tampermonkey.net/
// @version      0.1.1.20170724.1
// @description  try to take over the world!
// @author       nancybaby233
// @match        https://opr.ingress.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @homepageURL  https://github.com/nancybaby002/OPR-INDEX-TOOLS
// @updateURL    https://raw.githubusercontent.com/nancybaby002/OPR-INDEX-TOOLS/master/opr.index.tools.CHN.user.js
// @downloadURL  https://raw.githubusercontent.com/nancybaby002/OPR-INDEX-TOOLS/master/opr.index.tools.CHN.user.js
// ==/UserScript==

(function () {
    'use strict';
    // 纠偏数量 默认为0
    var Cookie = new function () {
        // 以分钟为单位添加cookie
        this.add_minute = function (name, value, time) {
            var life = new Date().getTime();
            life += time * 1000 * 60;
            var cookieStr = name + "=" + escape(value) + ";expires="
                + new Date(life).toGMTString();
            document.cookie = cookieStr;
        };
        // 以小时为单位添加cookie
        this.add_hours = function (name, value, time) {
            this.add_minute(name, value, time * 60)
        };
        // 以天为单位添加cookie
        this.add_day = function (name, value, time) {
            this.add_hours(name, value, time * 24);
        };
        // 获取cookie值
        this.get = function (name) {
            var cookies = document.cookie.split("; ");
            if (cookies.length > 0) {
                for (var s in cookies) {
                    var cookie = cookies[s].split("=");
                    if (cookie[0] == name)
                        return unescape(cookie[1]);
                }
            }
            return null;
        };
        // 删除cookie
        this.remove = function (name) {
            var cookieStr = name + "=" + escape('null') + ";expires="
                + new Date().toGMTString();
            document.cookie = cookieStr;
        };
    };

    var correctNum = Cookie.get("CORRECTNUM") ? Cookie.get("CORRECTNUM") : 0;
    const totalCount = parseInt($(".gold")[0].innerText);
    const createCount = parseInt($(".gold")[1].innerText);
    const rejectCount = parseInt($(".gold")[2].innerText);
    const totalAllPass = rejectCount + createCount;
    var passRatio = (totalAllPass / (totalCount - correctNum) * 100).toFixed(2);
    var totalPass = createCount + rejectCount - correctNum;

    // 实际通过数
    function showTotalPass() {
        $("#player_stats div").append('<br><p>' +
            '<span class="glyphicon glyphicon-info-sign ingress-gray pull-left" uib-tooltip-trigger="outsideclick" uib-tooltip-placement="left" tooltip-class="goldBorder" uib-tooltip="通过比例"></span>' +
            '<span style="margin-left: 5px" class="ingress-mid-blue pull-left">总通过数：</span>' +
            '<span class="gold pull-right totalPass">' + totalAllPass + '</span>' +
            '</p>');
    }

    // 总有效数
    function showCurPass() {
        $("#player_stats div").append('<br><p>' +
            '<span class="glyphicon glyphicon-info-sign ingress-gray pull-left" uib-tooltip-trigger="outsideclick" uib-tooltip-placement="left" tooltip-class="goldBorder" uib-tooltip="通过比例"></span>' +
            '<span style="margin-left: 5px" class="ingress-mid-blue pull-left">总有效数：</span>' +
            '<span class="gold pull-right totalPass">' + totalPass + '</span>' +
            '</p>');
    }

    // 通过比例
    function showPassRatio() {
        $("#player_stats div").append('<br><p>' +
            '<span class="glyphicon glyphicon-info-sign ingress-gray pull-left" uib-tooltip-trigger="outsideclick" uib-tooltip-placement="left" tooltip-class="goldBorder" uib-tooltip="通过比例"></span>' +
            '<span style="margin-left: 5px" class="ingress-mid-blue pull-left">通过比例：</span>' +
            '<span class="gold pull-right passRatio">' + passRatio + '%（' + totalAllPass + ' / ' + (totalCount) + '）</span>' +
            '</p>');
    }

    //Bronze: 100
    //Silver: 750
    //Gold: 2500
    //Platinum: 5000
    //Onyx: 10000
    // 展示进度条
    function showProcessBar(update) {
        // update作为更新的标识符
        if (!update) {
            $("#player_stats div").append("<span class='process_container' style='display: block'></span>");
        }
        var barRate;
        var achieveName;
        var target;
        var achieveSet = {
            1: {
                achieveName: "铜",
                target: 100
            },
            2: {
                achieveName: "银",
                target: 750
            },
            3: {
                achieveName: "金",
                target: 2500
            },
            4: {
                achieveName: "钛",
                target: 5000
            },
            5: {
                achieveName: "黑",
                target: 10000
            },
        };

        function countResult(index) {
            target = achieveSet[index].target;
            barRate = (totalPass / achieveSet[index].target * 100).toFixed(2);
            achieveName = achieveSet[index].achieveName;
        }

        if (totalPass < achieveSet[1].target) {
            countResult(1);
        } else if (totalPass >= achieveSet[1].target && totalPass < achieveSet[2].target) {
            countResult(2);
        } else if (totalPass >= achieveSet[2].target && totalPass < achieveSet[3].target) {
            countResult(3);
        } else if (totalPass >= achieveSet[3].target && totalPass < achieveSet[4].target) {
            countResult(4);
        } else if (totalPass >= achieveSet[4].target && totalPass < achieveSet[5].target) {
            countResult(5);
        } else {
            target = 10000;
            barRate = 100;
            achieveName = "黑";
        }
        $(".process_container").empty();
        var process = '<br><p>' +
            '<span class="glyphicon glyphicon-info-sign ingress-gray pull-left" uib-tooltip-trigger="outsideclick" uib-tooltip-placement="left" tooltip-class="goldBorder" uib-tooltip="按你评审结果而驳回的Portal数量"></span>' +
            '<span style="margin-left: 5px" class="ingress-mid-blue pull-left">开' + achieveName + '牌进度：</span>' +
            '<span class="gold pull-right">' + barRate + '%（' + totalPass + ' / ' + target + '）</span>' +
            '</p>';
        process = process + '<br><div class="progress progress-striped active"> <div class="progress-bar progress-bar-warning" role="progressbar"aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"style="width: ' + barRate + '%;"> </div></div>';
        $(".process_container").append(process);
    }


    // 纠偏模块
    function showCorrect() {
        $("#player_stats div").append('<br><p>' +
            '<span class="glyphicon glyphicon-info-sign ingress-gray pull-left" uib-tooltip-trigger="outsideclick" uib-tooltip-placement="left" tooltip-class="goldBorder" uib-tooltip="偏移量"></span>' +
            '<span style="margin-left: 5px;cursor: pointer;" class="ingress-mid-blue pull-left" id="doCorrect">偏移量（点击输入）</span>' +
            '<span class="gold pull-right correctNum">' + correctNum + '</span>' +
            '</p>');
    }

    function doCorrect() {
        correctNum = prompt("请输入偏移量。(总通过数-实际牌子显示数量)", "0");
        correctNum = correctNum ? correctNum : "0";
        correctNum = parseInt(correctNum);
        if (correctNum >= totalAllPass) {
            alert("输入差值有误,请重新输入");
            return;
        }
        $(".correctNum").text(correctNum);
        // 存差值到cookies
        Cookie.add_day("CORRECTNUM", correctNum, 100);
        updateStats();
    }

    function updateStats() {
        // 更新总通过数（纠偏）
        totalPass = createCount + rejectCount - correctNum;
        showProcessBar(1);
        //$(".totalPass").text(totalPass);
        //更新通过比例（纠偏）
        //var passRatioString=passRatio + '%（' + totalPass + ' / ' + (totalCount-correctNum) +')';
        //$(".passRatio").text(passRatioString)
        //showProcessBar();
    }


    $(function () {
        showTotalPass();
        showPassRatio()
        showCurPass();
        showProcessBar();
        showCorrect();
        $(document).on('click', '#doCorrect', function () {
            doCorrect();
        });
    });
})();
$(function () {
    var score = 0,
        life = 100,
        timer = null,
        levelProfiles = [{
                level: 1,
                score: 0,
                moles: 1,
                lifeReduce: 1,
                interval: 1500
            },
            {
                level: 2,
                score: 100,
                moles: 2,
                lifeReduce: 1,
                interval: 1500
            },
            {
                level: 3,
                score: 200,
                moles: 2,
                lifeReduce: 5,
                interval: 1250
            },
            {
                level: 4,
                score: 300,
                moles: 2,
                lifeReduce: 5,
                interval: 1000
            },
            {
                level: 5,
                score: 500,
                moles: 3,
                lifeReduce: 10,
                interval: 1000
            },
            {
                level: 6,
                score: 1000,
                moles: 3,
                lifeReduce: 10,
                interval: 750
            },
        ];

    var $playground = $("#playground");

    $playground.on("click", ".mole", function () {
        // 打地鼠事件
        var $this = $(this);
        if ($this.is(".active")) {
            score += 10;
            $this.removeClass("active").addClass("hit");

            // 更新成績
            $("#current-score").text(score);
        }
    });

    // 介面變更事件
    $("#sizing").change(function () {
        var $size = +$("#sizing").val();
        setPlayground($size);
    });

    // 遊戲開始點擊事件
    $("#start").click(startGame);

    // 遊戲結束點擊事件
    $("#stop").click(stopGame);

    // 設定遊戲介面
    function setPlayground(size) {
        $playground.html("");

        var $table = $("<table></table>");
        for (var i = 0; i < size; i++) {
            var $tr = $("<tr></tr>");
            for (var j = 0; j < size; j++) {
                var $td = $("<td><div class=\"mole\"></div></td>");
                $td.appendTo($tr);
            }
            $tr.appendTo($table);
        }

        // 為了置中
        $table.appendTo($playground).css({
            "marginTop": -1 * ($table.outerHeight() / 2),
            "marginLeft": -1 * ($table.outerWidth() / 2)
        });
    }

    // 遊戲開始
    function startGame() {
        score = 0;
        life = 100;
        $("#sizing").attr("disabled","disabled");
        updateLife();
        nextMole();
    }

    // 遊戲結束
    function stopGame() {
        clearTimeout(timer);
        $(".mole.active").removeClass("active");
        $(".mole.hit").removeClass("hit");
        $("#sizing").removeAttr('disabled');
    }

    // 計算目前 Level
    function getLevelProfile() {
        // 取得目前等級參數
        var levelProfile = levelProfiles[0];
        for (var i = 0; i < levelProfiles.length; i++) {
            if (score >= levelProfiles[i].score) {
                levelProfile = levelProfiles[i];
            } else {
                break;
            }
        }
        return levelProfile;
    }

    // 更新生命
    function updateLife() {
        $("#progress")
            .css("width", `${life}%`)
            .text(life);
    }

    // 重生地鼠、判定遊戲是否結束
    function nextMole() {
        var $moles = $(".mole");
        var levelProfile = getLevelProfile();

        var active = $moles.filter(".active").length;
        var hit = $moles.filter(".hit").length;
        var lifeReduce = Math.max(0, (active - hit) * levelProfile.lifeReduce);
        life = life - lifeReduce < 0 ? 0 :  life - lifeReduce; // 生命扣到 0 不倒扣
       
        updateLife();

        if (life == 0) {
            stopGame();
            alert("GAME OVER!");
            return;
        }

        $moles.removeClass("active").removeClass("hit");

        $("#current-level").text(levelProfile.level);

        for (var i = 0; i < levelProfile.moles; i++) {
            var next = Math.floor(Math.random() * $moles.length);
            $moles.eq(next).addClass("active");
        }

        timer = setTimeout(nextMole, levelProfile.interval);
    }

    // 預設 3x3
    setPlayground(3);
});
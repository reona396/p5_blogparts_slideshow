var s = function(p) {

    var canvas;
    var canvasY;
    var data;
    var images = [];
    var itemNum;
    var imageW, imageH;
    var alp;
    var nowImageIndex;
    var margin;
    var leftButton, rightButton;
    var itemBaseUrl;
    var itemKindUrl;
    var buttonFontSize;
    var buttonW;
    var buttonH;
    var itemFontSize;

    p.preload = function() {
        p.loadJSON("http://blog.livedoor.jp/reona396/slide_fullg/data.json", p.preloadImages);
        // p.loadJSON("./data.json", p.preloadImages);
    }

    p.preloadImages = function(jsonData) {
        // JSONデータの格納
        data = jsonData;
        // 商品数
        itemNum = jsonData.length;

        // 画像のロード
        for (var i = 0; i < itemNum; i++) {
            images[i] = p.loadImage("http://blog.livedoor.jp/reona396/slide_fullg/image" + p.nf(i, 2) + ".png");
            // images[i] = p.loadImage("images/image" + p.nf(i,2) + ".png");
        }
    }

    p.setup = function() {
        canvasY = 50;
        alp = 0;
        nowImageIndex = 0;
        itemFontSize = 10;
        itemBaseUrl = "https://suzuri.jp/reona396/";
        itemKindUrl = "/full-graphic-t-shirt/s/white";

        buttonFontSize = "16px";
        buttonW = "30px";
        buttonH = "40px";

        imageW = images[0].width;
        imageH = imageW;
        canvas = p.createCanvas(imageW, imageH);
        canvas.position(0, canvasY);
        canvas.parent("myP5");

        p.background(95);

        p.imageMode(p.CENTER);
        p.rectMode(p.CENTER);
        p.textAlign(p.CENTER, p.CENTER);

        // 商品画像の周りの余白
        margin = (p.width - imageW) / 2;

        leftButton = p.createButton("<");
        leftButton.mousePressed(function() {
            p.pushButton("left")
        });
        leftButton.style("font-size", buttonFontSize);
        leftButton.style("background-color", "transparent");
        leftButton.style("width", buttonW);
        leftButton.style("height", buttonH);
        leftButton.style("border", "none");
        leftButton.style("outline", "none");
        leftButton.parent("myP5");
        leftButton.hide();
        leftButton.position(margin, canvasY + p.height / 2 - leftButton.height / 2);

        rightButton = p.createButton(">");
        rightButton.mousePressed(function() {
            p.pushButton("right")
        });
        rightButton.style("font-size", buttonFontSize);
        rightButton.style("background-color", "transparent");
        rightButton.style("width", buttonW);
        rightButton.style("height", buttonH);
        rightButton.style("border", "none");
        rightButton.style("outline", "none");
        rightButton.parent("myP5");
        rightButton.hide();
        rightButton.position(p.width - margin - rightButton.width, canvasY + p.height / 2 - leftButton.height / 2);
    }

    p.draw = function() {
        //画像表示
        p.showImage();

        // 商品画像にオンマウス
        if (p.isOnPicture()) {
            // タイトルパネル表示
            p.showTitle();

            // ボタンの表示と色操作
            leftButton.show();
            rightButton.show();
            p.operateButtonColor();
        }
        // 商品画像にオンマウスしていない
        else {
            // 画像切り替え
            p.switchImage();

            // ボタンを非表示
            leftButton.hide();
            rightButton.hide();
        }
    }

    p.mousePressed = function() {
        // マウスが左右ボタン上ではない場所でクリックされたら商品URLを開く
        if (p.isOnPicture() && !p.isOnLeftButton() && !p.isOnRightButton()) {
            window.open(itemBaseUrl + data[nowImageIndex].id + itemKindUrl, '_blank');
        }
    }

    p.showImage = function() {
        // 商品画像を表示、切り替え時はアルファ値が変動
        p.tint(255, 255 * p.abs(p.sin(p.radians(alp))));
        p.image(images[nowImageIndex], p.width / 2, p.height / 2);
    }

    p.isOnPicture = function() {
        // マウスが商品画像上にあればtrue
        if (p.mouseX > margin && p.mouseX < p.width - margin &&
            p.mouseY > margin && p.mouseY < p.height - margin) {
            return true;
        } else {
            return false;
        }
    }

    p.showTitle = function() {
        // タイトルパネル表示
        p.noStroke();
        p.fill(128, 150);
        p.rect(p.width / 2, p.height / 2, imageW, p.height / 5);
        p.fill(255);
        p.textSize(itemFontSize);
        p.text(data[nowImageIndex].name, p.width / 2, p.height / 2);
    }

    p.operateButtonColor = function() {
        // マウスが左ボタン上にある時ボタンカラーを緑に変更
        if (p.isOnLeftButton()) {
            leftButton.style("color", "#0f0");
        } else {
            leftButton.style("color", "#fff");
        }

        // マウスが右ボタン上にある時ボタンカラーを緑に変更
        if (p.isOnRightButton()) {
            rightButton.style("color", "#0f0");
        } else {
            rightButton.style("color", "#fff");
        }
    }

    p.isOnLeftButton = function() {
        // マウスが左ボタン上にあればtrue
        if (p.mouseX > leftButton.x && p.mouseX < leftButton.x + leftButton.width &&
            p.mouseY > leftButton.y - canvasY && p.mouseY < leftButton.y + leftButton.height - canvasY) {
            return true;
        } else {
            return false;
        }
    }

    p.isOnRightButton = function() {
        // マウスが右ボタン上にあればtrue
        if (p.mouseX > rightButton.x && p.mouseX < rightButton.x + rightButton.width &&
            p.mouseY > rightButton.y - canvasY && p.mouseY < rightButton.y + rightButton.height - canvasY) {
            return true;
        } else {
            return false;
        }
    }

    p.switchImage = function() {
        // 画像切り替え時のアルファ値
        alp += 2;

        //次の画像へ
        if (alp > 360) {
            alp = 0;
            nowImageIndex++;
            //画像が一巡したら最初の画像へ
            if (nowImageIndex > images.length - 1) {
                nowImageIndex = 0;
            }
        }
    }

    p.pushButton = function(direction) {
        // ボタンが押されたら表示中の情報のインデックスを変更
        if (direction == "left") {
            nowImageIndex--;
            if (nowImageIndex < 0) {
                nowImageIndex = itemNum - 1;
            }
        } else {
            nowImageIndex++;
            if (nowImageIndex > itemNum - 1) {
                nowImageIndex = 0;
            }
        }
    }
}
new p5(s, 'myP5');

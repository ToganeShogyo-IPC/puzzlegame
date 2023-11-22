const gridrow = 7;
const gridcol = 11;
const gridsize = 100;
var grid;
var background;

function drawGrid(rowCount,colCount,cellSize){ //グリッド書く関数 (引数→よこ,たて,セルサイズ)
    grid.clear();
    var width = colCount * cellSize;
    var height = rowCount * cellSize;
    grid.lineStyle(1, 0xffffff, 1);
    for (var i = 0; i <= rowCount; i++) {
        var y = i * cellSize;
        grid.moveTo(0, y);
        grid.lineTo(width, y);
    }

    for (var i = 0; i <= colCount; i++) {
        var x = i * cellSize;
        grid.moveTo(x, 0);
        grid.lineTo(x, height);
    }

    grid.strokePath();
}

class gameTitle extends Phaser.Scene{ // シーン:ゲームタイトル
    constructor(){
        super({ key: 'gameTitle', active: true});
    }

    preload(){

    }
    create(){
        const { width, height } = this.game.canvas;
        const zone = this.add.zone(width/2, height/2, width, height);

        background = this.add.graphics();
        background.fillStyle(0xDCDCE6, 1);
        background.fillRect(0, 0, game.config.width, game.config.height);
        this.add.text(100, 350, 'Click to Start Game').setFontSize(32).setColor('#00f');

        zone.setInteractive({
            useHandCursor: true
        });
        zone.on('pointerdown', () => {
            this.scene.start("gameScene")
        });
    }
    update(){

    }
}

class gameScene extends Phaser.Scene{ // シーン:ゲームプレイ画面
    constructor(){
        super({ key: 'gameScene', active: false });
    }

    preload(){ //リソースの読み込み
        this.load.spritesheet("Player","img/character/Magnet/Play_N.png", {frameWidth:100,frameHeight:100});
    }

    create(){ //オブジェクト生成
        background = this.add.graphics();
        grid = this.add.graphics();
        background.fillStyle(0xDCDCE6, 1);
        background.fillRect(0, 0, game.config.width, game.config.height);
        drawGrid(gridrow,gridcol,gridsize);

        var player = this.add.sprite(50,50,"Player").setInteractive({ draggable: true });

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0x9696DC); // ドラッグ中のキャラクターの色を変更
        });

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            if(dragX < 0){
                dragX = 0;
            }
            if(dragY < 0){
                dragY = 0;
            }
            if(dragX > 1100){
                dragX = 1050;
            }
            if(dragY > 700){
                dragY = 650;
            }
            gameObject.x = Phaser.Math.Snap.To(dragX, gridsize,50);
            gameObject.y = Phaser.Math.Snap.To(dragY, gridsize,50);
        });

        this.input.on('dragend', function (pointer, gameObject) {
            gameObject.clearTint(); // ドラッグが終了したら色をクリア
        });
    }

    update(){ //プレイ中に更新する必要がある何か

    }
}

var config = {
    parent: 'content',
    type: Phaser.AUTO,
    width: 1100,
    height: 700,
    scene:[gameTitle,gameScene],
};
let game = new Phaser.Game(config);
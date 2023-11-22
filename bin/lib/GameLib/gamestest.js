const gridrow = 7;
const gridcol = 11;
const gridsize = 100;
const StaType1 = [7,11,100];
var grid;
var background;

function drawGrid(rowCount, colCount, cellSize) {
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

class gameTitle extends Phaser.Scene {
    constructor() {
        super({ key: 'gameTitle', active: true });
    }

    preload() {

    }
    create() {
        const { width, height } = this.game.canvas;
        const zone = this.add.zone(width / 2, height / 2, width, height);

        background = this.add.graphics();
        background.fillStyle(0xDCDCE6, 1);
        background.fillRect(0, 0, game.config.width, game.config.height);
        this.add.text(100, 350, 'Click to Start Game').setFontSize(32).setColor('#00f');

        zone.setInteractive({
            useHandCursor: true
        });
        zone.on('pointerdown', () => {
            this.scene.start("gameSelect"); // gameSelect シーンに遷移
        });
    }
    update() {

    }
}

class gameSelect extends Phaser.Scene {
    constructor() {
        super({ key: 'gameSelect', active: false });
    }

    preload() {
        // gameSelect シーンで使用するリソースの読み込みがあれば行う
    }

    create() {
        const { width, height } = this.game.canvas;

        // gameTitleと同じ背景色を設定
        background = this.add.graphics();
        background.fillStyle(0xDCDCE6, 1);
        background.fillRect(0, 0, game.config.width, game.config.height);

        // ボタンを配置
        const buttonSize = 90;
        const buttonSpacing = buttonSize/9; // ボタン間の間隔
        const totalButtons = 7;

        for (let i = 0; i < totalButtons; i++) {
            const buttonX = width/4*3;
            const buttonY = height / 8 + (i * (buttonSize/3*2 + buttonSpacing));

            const selectButton = this.add.text(buttonX, buttonY, 'Stage ' + (i + 1), { fontSize: '84px', fill: '#00f' })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .setDisplaySize(buttonSize*2, buttonSize/2);

            // ボタンの周りに線を追加
            const buttonBounds = selectButton.getBounds();
            const buttonOutline = this.add.graphics();
            buttonOutline.lineStyle(2, 0X000000); // 黒い線
            buttonOutline.strokeRect(buttonBounds.x, buttonBounds.y, buttonBounds.width, buttonBounds.height);

            selectButton.on('pointerdown', () => {
                // ステージのデータを設定
                const selectedStage = i + 1; // ステージ番号は1から始まるため

                // gameScene に遷移し、選択されたステージのデータを渡す
                this.scene.start("gameScene", { selectedStage });
            });
        }
    }

    update() {
        // gameSelect シーン内で更新が必要な場合はここに追加
    }
}




class gameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameScene', active: false });
    }

    preload() {
        this.load.spritesheet("Player", "img/character/Magnet/Play_N.png", { frameWidth: 100, frameHeight: 100 });
    }

    create() {
        background = this.add.graphics();
        grid = this.add.graphics();
        background.fillStyle(0xDCDCE6, 1);
        background.fillRect(0, 0, game.config.width, game.config.height);
        drawGrid(gridrow, gridcol, gridsize);

        // gameSelect シーンからのデータを受け取る
        const selectedStage = this.scene.settings.data.selectedStage || 1;

        var player = this.add.sprite(50, 50, "Player").setInteractive({ draggable: true });

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0x9696DC);
        });

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            if (dragX < 0) {
                dragX = 0;
            }
            if (dragY < 0) {
                dragY = 0;
            }
            if (dragX > 1100) {
                dragX = 1050;
            }
            if (dragY > 700) {
                dragY = 650;
            }
            gameObject.x = Phaser.Math.Snap.To(dragX, gridsize, 50);
            gameObject.y = Phaser.Math.Snap.To(dragY, gridsize, 50);
        });

        this.input.on('dragend', function (pointer, gameObject) {
            gameObject.clearTint();
        });
    }

    update() {

    }
}

var config = {
    parent: 'content',
    type: Phaser.AUTO,
    width: 1100,
    height: 700,
    scene: [gameTitle, gameSelect, gameScene], // gameSelect クラスを追加
};
let game = new Phaser.Game(config);

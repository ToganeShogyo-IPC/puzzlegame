const gridSettings = {
    row: 7,
    col: 11,
    size: 100,
};

const buttonSettings = {
    size: 90,
    spacing: 90 / 9,
};

var grid;
var background;
var PlayerOld_Y;
var PlayerOld_X;

function drawGrid(rowCount, colCount, cellSize) {
    grid.clear();
    const width = colCount * cellSize;
    const height = rowCount * cellSize;

    grid.lineStyle(1, 0xffffff, 1);

    for (let i = 0; i <= rowCount; i++) {
        const y = i * cellSize;
        grid.moveTo(0, y).lineTo(width, y);
    }

    for (let i = 0; i <= colCount; i++) {
        const x = i * cellSize;
        grid.moveTo(x, 0).lineTo(x, height);
    }

    grid.strokePath();
}

class gameTitle extends Phaser.Scene {
    constructor() {
        super({ key: 'gameTitle', active: true });
    }

    preload() {}

    create() {
        const { width, height } = this.game.canvas;
        const zone = this.add.zone(width / 2, height / 2, width, height);

        background = this.add.graphics();
        background.fillStyle(0xEBEEFB, 1);
        background.fillRect(0, 0, this.game.config.width, this.game.config.height);
        this.add.text(100, 350, 'Click to Start Game').setFontSize(32).setColor('#00f');

        zone.setInteractive({
            useHandCursor: true
        });

        zone.on('pointerdown', () => {
            this.scene.start("gameSelect");
        });
    }

    update() {}
}

class gameSelect extends Phaser.Scene {
    constructor() {
        super({ key: 'gameSelect', active: false });
    }

    preload() {}

    create() {
        const { width, height } = this.game.canvas;

        background = this.add.graphics();
        background.fillStyle(0xEBEEFB, 1);
        background.fillRect(0, 0, this.game.config.width, this.game.config.height);

        for (let i = 0; i < 7; i++) {
            const buttonX = width / 4 * 3;
            const buttonY = height / 8 + (i * (buttonSettings.size / 3 * 2 + buttonSettings.spacing));

            const selectButton = this.add.text(buttonX, buttonY, `Stage ${i + 1}`, { fontSize: '84px', fill: '#00f' })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .setDisplaySize(buttonSettings.size * 2, buttonSettings.size / 2);

            const buttonBounds = selectButton.getBounds();
            const buttonOutline = this.add.graphics();
            buttonOutline.lineStyle(2, 0x000000);
            buttonOutline.strokeRect(buttonBounds.x, buttonBounds.y, buttonBounds.width, buttonBounds.height);

            selectButton.on('pointerdown', () => {
                this.scene.start("gameScene", { selectedStage: i + 1 });
            });
        }
    }

    update() {}
}

class gameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameScene', active: false });
    }

    preload() {
        this.load.spritesheet("Player_N", "img/character/Magnet/Play_N.png", { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Player_S", "img/character/Magnet/Play_S.png", { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Fixed_N", "img/fixed_item/Magnet/Fixed_N.png", { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Fixed_S", "img/fixed_item/Magnet/Fixed_S.png", { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Operatable_N", "img/fixed_item/Magnet/Operatable_N.png", { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Operatable_S", "img/fixed_item/Magnet/Operatable_S.png", { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("splitter", "img/fixed_item/Splitter.png", { frameWidth: 120, frameHeight: 120 });
        this.load.spritesheet("splitter", "img/fixed_item/Wall.png", { frameWidth: 100, frameHeight: 100 });
    }

    create() {
        background = this.add.graphics();
        grid = this.add.graphics();
        background.fillStyle(0xEBEEFB, 1);
        background.fillRect(0, 0, this.game.config.width, this.game.config.height);
        drawGrid(gridSettings.row, gridSettings.col, gridSettings.size);

        const selectedStage = this.scene.settings.data.selectedStage || 1;

        // 新しいメソッドでマップを作成
        this.createMap(selectedStage);

        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0x9696DC);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            const limit = 100;
            const snapSize = 50;

            dragX = Phaser.Math.Snap.To(dragX, gridSettings.size, snapSize);
            dragY = Phaser.Math.Snap.To(dragY, gridSettings.size, snapSize);

            if (Math.abs(dragX - PlayerOld_X) >= limit || Math.abs(dragX - PlayerOld_X) >= limit) {
                dragX = PlayerOld_X + (limit * Math.sign(dragX - PlayerOld_X));
            }

            if (Math.abs(dragY - PlayerOld_Y) >= limit || Math.abs(dragY - PlayerOld_Y) >= limit) {
                dragY = PlayerOld_Y + (limit * Math.sign(dragY - PlayerOld_Y));
            }

            gameObject.x = PlayerOld_X = dragX;
            gameObject.y = PlayerOld_Y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.clearTint();
        });
    }

    update() {}

    // 新しいメソッドでマップを作成する
    createMap(selectedStage) {
        // マップデータを取得する（ここでは例として手動）
        const mapData = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
 
        // マップサイズの設定
        const tileSize = gridSettings.size;
        const mapWidth = mapData[0].length;
        const mapHeight = mapData.length;

        // マップの描画
        for (let row = 0; row < mapHeight; row++) {
            for (let col = 0; col < mapWidth; col++) {
                const tileType = mapData[row][col];
                const x = col * tileSize;
                const y = row * tileSize;

                if (tileType === 1) {
                    this.add.sprite(x + 50, y + 50, "Wall");
                }
                // Player_N タイルの描画
                if (tileType === 2) {
                    this.add.sprite(x + 50, y + 50, "Player_N").setInteractive({ draggable: true });
                }

                // Player_S タイルの描画
                if (tileType === 3) {
                    this.add.sprite(x + 50, y + 50, "Player_S").setInteractive({ draggable: true });
                }

                // 他のタイルに対する描画処理
                if (tileType === 4) {
                    this.add.sprite(x + 50, y + 50, "Fixed_N");
                }
                if (tileType === 5) {
                    this.add.sprite(x + 50, y + 50, "Fixed_S");
                }
                if (tileType === 6) {
                    this.add.sprite(x + 50, y + 50, "Operatable_N");
                }
                if (tileType === 7) {
                    this.add.sprite(x + 50, y + 50, "Operatable_S");
                }
                if (tileType === 8) {
                    this.add.sprite(x + 50, y + 50, "Splitter");
                }
                // 他のタイルの描画処理を追加
            }
        }
    }
}

var config = {
    parent: 'content',
    type: Phaser.AUTO,
    width: 1100,
    height: 700,
    scene: [gameTitle, gameSelect, gameScene],
};

let game = new Phaser.Game(config);
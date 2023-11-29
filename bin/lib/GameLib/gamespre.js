class gameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameScene', active: false });
    }

    preload() {
        this.load.spritesheet("Player_N", "img/character/Magnet/Play_N.png", { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Player_S", "img/character/Magnet/Play_S.png", { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Fixed_N", "img/fixed_item/Magnet/Fixed_N.png", { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Fixed_S", "img/fixed_item/Magnet/Fixed_S.png", { frameWidth: 100, frameHeight: 100 });
        // 他の画像のプリロード処理を追加
    }

    create() {
        background = this.add.graphics();
        grid = this.add.graphics();
        background.fillStyle(0xEBEEFB, 1);
        background.fillRect(0, 0, this.game.config.width, this.game.config.height);
        drawGrid(gridSettings.row, gridSettings.col, gridSettings.size);

        const selectedStage = this.scene.settings.data.selectedStage || 1;

        this.createMap(selectedStage);

        // プレイヤーの作成と物理エンジンの有効化
        playerN = this.physics.add.sprite(/* 初期座標 */);
        playerS = this.physics.add.sprite(/* 初期座標 */);

        // 壁のグループを作成
        walls = this.physics.add.group();
        // 壁を作成してグループに追加
        // ...

        // 他の初期化処理を追加

        // ドラッグイベントの追加
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0x9696DC);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            const limit = 100;
            const snapSize = 50;

            dragX = Phaser.Math.Snap.To(dragX, gridSettings.size, snapSize);
            dragY = Phaser.Math.Snap.To(dragY, gridSettings.size, snapSize);

            // 移動制限の処理

            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.clearTint();
        });
    }

    update() {
        // Player_NとPlayer_Sの壁判定
        this.physics.world.collide(playerN, walls, this.handleCollision, null, this);
        this.physics.world.collide(playerS, walls, this.handleCollision, null, this);

        // 他の更新処理を追加
    }

    handleCollision(player, wall) {
        // 壁にぶつかった時の処理を追加
        // 例えば、特定のエフェクトを再生したり、効果音を再生したりすることが考えられます
    }

    createMap(selectedStage) {
        // マップデータの取得（省略部分）

        const mapWidth = mapData[0].length;
        const mapHeight = mapData.length;
        const tileSize = gridSettings.size;

        for (let row = 0; row < mapHeight; row++) {
            for (let col = 0; col < mapWidth; col++) {
                const tileType = mapData[row][col];
                const x = col * tileSize;
                const y = row * tileSize;

                if (tileType === 1) {
                    // 壁の描画
                    walls.create(x + 50, y + 50, "Wall").setOrigin(0.5);
                }
                if (tileType === 2) {
                    playerN = this.physics.add.sprite(x + 50, y + 50, "Player_N").setInteractive({ draggable: true });
                }
                // 他のタイルに対する描画処理を追加
            }
        }
    }
}

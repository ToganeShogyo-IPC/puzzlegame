const gridSettings = {
    row: 7,
    col: 11,
    size: 100,
};

const buttonSettings = {
    size: 90,
    spacing: 90 / 9,
};

var skin = "Magnet";
var grid;
var background;
var mapjsondata=[];
var mapsdata=[];
var players = {
    "Player_N":{y:0,x:0},
    "Player_S":{y:0,x:0}
}

//------ローカルjsonファイルを読み込む関数------//
async function loadJsonFile(filename){
    let resp;
    const response = await fetch(filename);
    if(!response.ok){
        throw new Error(`HTTP Error ${response.status}`);
    }
    const text = await response.text();
    resp = JSON.parse(text);
    console.debug(text);
    return resp;
}

//存在するマップを全部読み込む
async function loadmapsdata(){
    const direcfiles = await loadJsonFile("lib/GameLib/maps/mapdata-all.php");
    direcfiles.forEach(async function(value){
        mapsdata.push(await loadJsonFile(`lib/GameLib/maps/${value}`));
        console.debug(value);
    });
}
loadmapsdata();//↑を呼んでるだけ

async function is_Draggable(gameObject=[],mapData=[],draggX=0,draggY=0){
    const notDraggableItems = [5,6,7,8];
    let returnItems = {left:true,right:true,up:true,down:true};
    console.debug(`x:${mapData[Math.floor(gameObject.x/100)]} (${Math.floor(gameObject.x/100)})`);
    console.debug(`y:${mapData[Math.floor(gameObject.y/100)]} (${Math.floor(gameObject.y/100)})`);

    let minusx = Math.floor(gameObject.x/100)-1;
    minusx = minusx < 0 ? 0 :minusx = minusx >= gridSettings.col-1 ? gridSettings.col -1 :minusx;
    let plusx = Math.floor(gameObject.x/100)+1;
    plusx = plusx < 0 ? 0 : plusx >= gridSettings.col-1 ? gridSettings.col -1 :plusx;
    let minusy = Math.floor(gameObject.y/100)-1;
    minusy = minusy < 0 ? 0 :minusy = minusy >= gridSettings.row-1 ? gridSettings.row -1 :minusy;
    let plusy = Math.floor(gameObject.y/100)+1;
    plusy = plusy < 0 ? 0 : plusy >= gridSettings.row-1 ? gridSettings.row -1 :plusy;

    let left = mapData[Math.floor(gameObject.y/100)][minusx];
    let right = mapData[Math.floor(gameObject.y/100)][plusx];
    let up = mapData[minusy][Math.floor(gameObject.x/100)];
    let down = mapData[plusy][Math.floor(gameObject.x/100)];

    if(notDraggableItems.includes(left)){//左
        returnItems.left = false;
    }
    if(notDraggableItems.includes(right)){//右
        returnItems.right = false;
    }
    if(notDraggableItems.includes(up)){//上
        returnItems.up = false;
    }
    if(notDraggableItems.includes(down)){//下
        returnItems.down = false;
    }
    console.debug(returnItems);
    return returnItems;
}

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
//---------ゲームタイトル---------//
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
            this.scene.start("stageSelect");
        });
    }

    update() {}
}
//---------ステージ選択画面---------//
class stageSelect extends Phaser.Scene {
    constructor() {
        super({ key: 'stageSelect', active: false });
    }

    preload() {}

    create() {
        const { width, height } = this.game.canvas;
    
        background = this.add.graphics();
        background.fillStyle(0xEBEEFB, 1);
        background.fillRect(0, 0, this.game.config.width, this.game.config.height);
        
        // 上段に4つのボタンを配置
        for (let i = 0; i < 4; i++) {
            const buttonX = width / 2 - ((3 * 150 + 2 * 100) / 2) + (i * (150 + 100))-50;
            const buttonY = height / 4;
            if(mapsdata[i]===undefined){continue;}
            const selectButton = this.add.text(buttonX, buttonY, `${mapsdata[i].title}`, { fontSize: '84px', fill: '#00f' })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .setDisplaySize(150, 150);
    
            const buttonBounds = selectButton.getBounds();
            const buttonOutline = this.add.graphics();
            buttonOutline.lineStyle(2, 0x000000);
            buttonOutline.strokeRect(buttonBounds.x, buttonBounds.y, buttonBounds.width, buttonBounds.height);
    
            selectButton.on('pointerdown', () => {
                this.scene.start("gameScene", { selectedStage: i});
            });
        }
    
        // 中段に4つのボタンを配置
        for (let i = 4; i < 9; i++) {
            const buttonX = width / 2 - ((3 * 150 + 2 * 100) / 2) + ((i-4) * (150 + 100))-50;
            const buttonY = height / 2 - 75 + height / 8;  // ここを修正
            if(mapsdata[i]===undefined){continue;}
            const selectButton = this.add.text(buttonX, buttonY, `${mapsdata[i].title}`, { fontSize: '84px', fill: '#00f' })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .setDisplaySize(150, 150);
    
            const buttonBounds = selectButton.getBounds();
            const buttonOutline = this.add.graphics();
            buttonOutline.lineStyle(2, 0x000000);
            buttonOutline.strokeRect(buttonBounds.x, buttonBounds.y, buttonBounds.width, buttonBounds.height);
    
            selectButton.on('pointerdown', () => {
                this.scene.start("gameScene", { selectedStage: i});
            });
        }
    }

    update() {}
}

//---------ゲームプレイ画面---------//
class gameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameScene', active: false });
    }

    preload() {
        this.load.spritesheet("Player_N", `img/character/${skin}/Play_N.png`, { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Player_S", `img/character/${skin}/Play_S.png`, { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Fixed_N", `img/fixed_item/${skin}/Fixed_N.png`, { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Fixed_S", `img/fixed_item/${skin}/Fixed_S.png`, { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Operatable_N", `img/fixed_item/${skin}/Operatable_N.png`, { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Operatable_S", `img/fixed_item/${skin}/Operatable_S.png`, { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet("Splitter", `img/fixed_item/${skin}/Splitter.png`, { frameWidth: 120, frameHeight: 120 });
        this.load.spritesheet("Wall", `img/fixed_item/${skin}/Wall.png`, { frameWidth: 100, frameHeight: 100 });
    }

    create() {
        background = this.add.graphics();
        grid = this.add.graphics();
        background.fillStyle(0xEBEEFB, 1);
        background.fillRect(0, 0, this.game.config.width, this.game.config.height);
        drawGrid(gridSettings.row, gridSettings.col, gridSettings.size);

        const selectedStage = this.scene.settings.data.selectedStage;

        // 新しいメソッドでマップを作成
        this.createMap(selectedStage);

        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0x9696DC);
        });

        this.input.on('drag',async (pointer, gameObject, dragX, dragY) => {
            const resp = await is_Draggable(gameObject,mapsdata[selectedStage].mapData);
            let objectname = gameObject.texture.key;
            const limit = 100;
            const snapSize = 50;

            dragX = Phaser.Math.Snap.To(dragX, gridSettings.size, snapSize);
            dragY = Phaser.Math.Snap.To(dragY, gridSettings.size, snapSize);

            if(dragX >= config.width){
                dragX = config.width - gridSettings.size/2;
            }
            if(dragX <= 0){
                dragX = gridSettings.size/2;
            }
            if(dragY >= config.height){
                dragY = config.height - gridSettings.size/2;
            }
            if(dragY <= 0){
                dragY = gridSettings.size/2;
            }
            
            if(dragX-players[objectname].x > 0 && !resp.right){//右に
                dragX = players[objectname].x;
            }
            if(dragX-players[objectname].x < 0 && !resp.left){//左に
                dragX = players[objectname].x;
            }
            if(dragY-players[objectname].y > 0 && !resp.down){//下に
                dragY = players[objectname].y;
            }
            if(dragY-players[objectname].y < 0 && !resp.up){//上に
                dragY = players[objectname].y;
            }

            if (Math.abs(dragX - players[objectname].x) >= limit || Math.abs(dragX - players[objectname].x) >= limit) {
                dragX = players[objectname].x + (limit * Math.sign(dragX - players[objectname].x));
            }

            if (Math.abs(dragY - players[objectname].y) >= limit || Math.abs(dragY - players[objectname].y) >= limit) {
                dragY = players[objectname].y + (limit * Math.sign(dragY - players[objectname].y));
            }


            gameObject.x = players[objectname].x = dragX;
            gameObject.y = players[objectname].y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.clearTint();
        });
    }

    update() {}

    // 新しいメソッドでマップを作成する
    createMap(selectedStage) {

        let mapData = mapsdata[selectedStage].mapData;

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
                
                switch (tileType){
                    case 1:
                        this.add.sprite(x + 50, y + 50, "Player_N").setInteractive({ draggable: true });
                        players["Player_N"].x = x + 50;
                        players["Player_N"].y = y + 50;
                        break;
                    case 2:
                        this.add.sprite(x + 50, y + 50, "Player_S").setInteractive({ draggable: true });
                        players["Player_S"].x = x + 50;
                        players["Player_S"].y = y + 50;
                        break;
                    case 3:
                        this.add.sprite(x + 50, y + 50, "Operatable_N");
                        break;
                    case 4:
                        this.add.sprite(x + 50, y + 50, "Operatable_S");
                        break;
                    case 5:
                        this.add.sprite(x + 50, y + 50, "Fixed_N");
                        break;
                    case 6:
                        this.add.sprite(x + 50, y + 50, "Fixed_S");
                        break;
                    case 7:
                        this.add.sprite(x + 50, y + 50, "Splitter");
                        break;
                    case 8:
                        this.add.sprite(x + 50, y + 50, "Wall");
                        break;
                }
            }
        }
    }
}

var config = {
    parent: 'content',
    type: Phaser.AUTO,
    width: 1100,
    height: 700,
    scene: [gameTitle, stageSelect, gameScene],
};

let game = new Phaser.Game(config);
/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  fireBullet() {
    this.gun = 1;
    this.fireGun.play();
    this.time.addEvent({
      delay: 150,
      callback: () => {
        this.gun = 0;
      },
      callbackScope: this,
      loop: false,
    });

    const bullet = this.physics.add.sprite(
      this.player.x,
      this.player.y,
      'bullet',
    );
    bullet.setScale(0.3);
    const PointerAngle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.input.activePointer.worldX,
      this.input.activePointer.worldY,
    );

    const vx = Math.cos(PointerAngle) * this.bulletSpeed;
    const vy = Math.sin(PointerAngle) * this.bulletSpeed;
    bullet.body.setVelocity(vx, vy);
    this.bullets.add(bullet);
  }

  killBat(bullet, bat) {
    this.killedBat.play();
    bullet.destroy(true, true);
    bat.destroy(true, true);
    this.score += 1;
    this.batRemaining -= 1;
    this.scoreText.setText(`Bat Killed : ${this.score}`);
    this.batText.setText(`Bat remaining : ${this.batRemaining}`);
    if (this.batRemaining === 0) {
      this.batSounds.stop();
      this.spawnBat();
      this.waveText.setText(`Wave : ${this.wave}`);
    }
  }

  onTouchEnemy(player) {
    this.physics.pause();
    this.sys.game.globals.score = this.score;
    player.setTint(0xff0000);
    this.heroDeath.play();
    this.batSounds.stop();
    this.bgMusic.stop();
    this.sys.game.globals.bgMusic.stop();
    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.scene.start('GameOver');
      },
      loop: false,
    });
  }

  killBullet(bullet) {
    bullet.destroy(true, true);
  }

  spawnBat() {
    if (this.batRemaining === 0) {
      this.wave += 1;
      this.batNumber += 50;
      this.bulletSpeed += 100;
      this.batRemaining = this.batNumber;
      this.batSpeed += 5;
      this.infoText = this.add.text(
        16,
        16,
        `Wave ${this.wave} coming in 5 seconds! \n         GET READY `,
        {
          fontSize: '24px',
          fill: '#fff',
        },
      );
      this.infoText.depth = 10;
      this.time.addEvent({
        delay: 5000,
        callback: () => {
          this.infoText.depth = -1;
          this.batSounds.play();
          for (let i = 0; i < this.batNumber; i += 1) {
            let tmp = true;
            while (tmp) {
              tmp = false;
              const x = Phaser.Math.RND.between(
                0,
                this.physics.world.bounds.width,
              );
              const y = Phaser.Math.RND.between(
                0,
                this.physics.world.bounds.height,
              );
              const dx = this.player.x - x;
              const dy = this.player.y - y;
              if (dx > 200 || dy > 200 || dx < -200 || dy < -200) {
                const bat = this.physics.add.sprite(x, y, 'bat', 1);
                this.bats.add(bat);
                tmp = false;
              } else {
                tmp = true;
              }
            }
          }
        },
        loop: false,
      });
    }
  }

  create() {
    this.infoText;
    this.score = 0;
    this.wave = 0;
    this.batNumber = 0;
    this.batRemaining = 0;
    this.batSpeed = 5;
    this.bulletSpeed = 100;
    this.cameras.main.setZoom(1.3);
    this.gun = 0;
    this.fireGun = this.sound.add('fireGun', {
      volume: 0.2,
      loop: false,
    });
    this.killedBat = this.sound.add('killedBat');
    this.batSounds = this.sound.add('batSounds', {
      volume: 0.2,
      loop: true,
    });
    this.heroDeath = this.sound.add('heroDeath');
    this.bgMusic = this.sound.add('bgMusic', { volume: 0.3, loop: true });
    this.bgMusic.play();
    // create the map
    const map = this.make.tilemap({ key: 'map' });

    // first parameter is the name of the tilemap in tiled
    const tiles = map.addTilesetImage('cyclope', 'tiles');

    // creating the layers
    map.createStaticLayer('map', tiles, 0, 0);
    const obstacles = map.createStaticLayer('obstacles', tiles, 0, 0);

    // make all tiles in obstacles collidable
    obstacles.setCollisionByExclusion([-1]);

    // create player sprite + bats and bullets groupes
    this.player = this.physics.add.sprite(50, 100, 'player', 6);
    this.bats = this.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });
    this.bullets = this.add.group();
    // spawn bats
    this.spawnBat();
    //  animation with key 'left'
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });

    // player animation keys
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [2, 8, 2, 14],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [0, 6, 0, 12],
      }),
      frameRate: 10,
      repeat: -1,
    });

    // bat animation keys
    this.anims.create({
      key: 'zleft',
      frames: this.anims.generateFrameNumbers('bat', {
        frames: [9, 10, 11],
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'zright',
      frames: this.anims.generateFrameNumbers('bat', {
        frames: [3, 4, 5],
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'zup',
      frames: this.anims.generateFrameNumbers('bat', {
        frames: [6, 7, 8],
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'zdown',
      frames: this.anims.generateFrameNumbers('bat', {
        frames: [0, 1, 2],
      }),
      frameRate: 10,
      repeat: -1,
    });

    // don't go out of the map
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);

    // don't walk on obstacles
    this.physics.add.collider(this.player, obstacles);
    this.physics.add.collider(this.bats, obstacles);

    // limit camera to map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true; // avoid tile bleed

    // user input

    this.upBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.downBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.rightBtn = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D,
    );
    this.leftBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    // add collider
    this.physics.add.overlap(
      this.bullets,
      this.bats,
      this.killBat,
      null,
      this,
    );
    this.physics.add.collider(
      this.player,
      this.bats,
      this.onTouchEnemy,
      false,
      this,
    );

    this.physics.add.collider(
      this.bullets,
      obstacles,
      this.killBullet,
      false,
      this,
    );
    // Score text
    this.scoreText = this.add.text(16, 16, `Bat killed : ${this.wave}`, {
      fontSize: '24px',
      fill: '#fff',
    });
    this.batText = this.add.text(
      16,
      32,
      `Bat remaining : ${this.batRemaining}`,
      {
        fontSize: '24px',
        fill: '#fff',
      },
    );
    this.waveText = this.add.text(16, 48, `Wave : ${this.wave}`, {
      fontSize: '24px',
      fill: '#fff',
    });
    this.scoreText.depth = 1000;
    this.batText.depth = 1000;
    this.waveText.depth = 1000;
  }

  update() {
    this.scoreText.x = 16 + this.cameras.main.worldView.left;
    this.scoreText.y = 16 + this.cameras.main.worldView.top;
    this.scoreText.setScale(0.5);
    this.batText.x = 16 + this.cameras.main.worldView.left;
    this.batText.y = 32 + this.cameras.main.worldView.top;
    this.batText.setScale(0.5);
    this.waveText.x = 16 + this.cameras.main.worldView.left;
    this.waveText.y = 48 + this.cameras.main.worldView.top;
    this.waveText.setScale(0.5);
    this.infoText.x = 100 + this.cameras.main.worldView.left;
    this.infoText.y = 100 + this.cameras.main.worldView.top;
    this.infoText.setScale(0.5);

    this.bats.getChildren().forEach((bat) => {
      bat.setScale(0.5);
      bat.body.collideWorldBounds = true;
      const dx = this.player.x - bat.x;
      const dy = this.player.y - bat.y;
      const angle = Math.atan2(dy, dx);
      const vx = Math.cos(angle) * this.batSpeed;
      const vy = Math.sin(angle) * this.batSpeed;
      bat.body.setVelocity(vx, vy);

      if (vy < 0 && dx < 50 && dx > -50) {
        bat.anims.play('zup', true);
      } else if (vy > 0 && dx < 50 && dx > -50) {
        bat.anims.play('zdown', true);
      } else if (vx > 0) {
        bat.anims.play('zright', true);
      } else if (vx < 0) {
        bat.anims.play('zleft', true);
      }
    }, this);

    this.player.body.setVelocity(0);

    if (this.input.activePointer.isDown && this.gun === 0) {
      this.fireBullet();
    }
    if (this.leftBtn.isDown) {
      this.player.body.setVelocityX(-80);
    } else if (this.rightBtn.isDown) {
      this.player.body.setVelocityX(80);
    }

    if (this.upBtn.isDown) {
      this.player.body.setVelocityY(-80);
    } else if (this.downBtn.isDown) {
      this.player.body.setVelocityY(80);
    }

    if (this.leftBtn.isDown) {
      this.player.anims.play('left', true);
      this.player.flipX = true;
    } else if (this.rightBtn.isDown) {
      this.player.anims.play('right', true);
      this.player.flipX = false;
    } else if (this.upBtn.isDown) {
      this.player.anims.play('up', true);
    } else if (this.downBtn.isDown) {
      this.player.anims.play('down', true);
    } else {
      this.player.anims.stop();
    }
  }
}

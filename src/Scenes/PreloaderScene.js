import Phaser from 'phaser';
import greenButton1 from '../assets/ui/green_button02.png';
import greenButton2 from '../assets/ui/green_button03.png';
import phaserLogo from '../assets/logo.jpg';
import box from '../assets/ui/unchecked.png';
import checkedBox from '../assets/ui/greenChecked.png';
import bgMusic from '../assets/Heroic.mp3';
import fireGun from '../assets/Weapon Blow.wav';
import killedBat from '../assets/bat_dead.wav';
import batSounds from '../assets/batsound.mp3';
import heroDeath from '../assets/Hero_Death_00.mp3';
import gameOverMusic from '../assets/GAMEOVER.wav';
import tiles from '../assets/map/cyclope.jpg';
import map from '../assets/map/batmap.json';
import player from '../assets/RPG_assets.png';
import bat from '../assets/bat-sprite.png';
import bullet from '../assets/bullet.png';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    // load assets needed in our game
    this.load.image('greenButton1', greenButton1);
    this.load.image('greenButton2', greenButton2);
    this.load.image('phaserLogo', phaserLogo);
    this.load.image('box', box);
    this.load.image('checkedBox', checkedBox);
    this.load.audio('bgMusic', [bgMusic]);
    this.load.audio('fireGun', [fireGun]);
    this.load.audio('killedBat', [killedBat]);
    this.load.audio('batSounds', [batSounds]);
    this.load.audio('heroDeath', [heroDeath]);
    this.load.audio('gameOverMusic', [gameOverMusic]);
    // map tiles
    this.load.image('tiles', tiles);

    // map in json format
    this.load.tilemapTiledJSON('map', map);

    // character spritesheet
    this.load.spritesheet('player', player, {
      frameWidth: 16,
      frameHeight: 16,
    });

    // bat spritesheet
    this.load.spritesheet('bat', bat, {
      frameWidth: 30,
      frameHeight: 35,
    });

    // load bullet

    this.load.image('bullet', bullet);

    // add logo image
    this.add.image(400, 200, 'logo');

    // display progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 150,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on('progress', (value) => {
      percentText.setText(`${parseInt(value * 100, 10)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });

    // remove progress bar when complete
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
    });

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);
  }

  ready() {
    this.scene.start('Title');
    this.readyCount += 1;
    if (this.readyCount === 2) {
      this.scene.start('Title');
    }
  }
}

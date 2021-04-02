import Phaser from 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    this.add.image(config.width / 2, config.height / 2 + 60, 'logo');
    // Game
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 4 - 90,
      'greenButton1',
      'greenButton2',
      'Play',
      'PlayerInput',
    );

    // High Scores
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 4 - 30,
      'greenButton1',
      'greenButton2',
      'High Score',
      'HighScore',
    );

    // Options
    this.optionsButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 155,
      'greenButton1',
      'greenButton2',
      'Options',
      'Options',
    );

    // Credits
    this.creditsButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 215,
      'greenButton1',
      'greenButton2',
      'Credits',
      'Credits',
    );

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }
}

import Phaser from 'phaser';
import config from '../Config/config';

export default class PlayerInputScene extends Phaser.Scene {
  constructor() {
    super('PlayerInput');
  }

  create() {
    this.text1 = this.add.text(
      config.width / 2 - 100,
      150,
      'You bet ?',
      {
        fontSize: '40px',
        fill: '#ffffff',
      },
    );
    this.text2 = this.add.text(
      config.width / 2 - 200,
      280,
      'Please Enter Your Name First:',
      {
        fontSize: '25px',
        fill: '#ffffff',
      },
    );

    this.input = this.add.dom(
      config.width / 2,
      380,
      'input',
      'background-color: white; width: 300px; height: 30px; font: 22px Times New Roman',
    );
    this.button = this.add.dom(
      config.width / 2,
      450,
      'button',
      'color:white;font-size:24px;background-color: #19d598; width: 220px; height: 50px;border:none;border-radius: 10px',
      'Start the game',
    );

    const addName = document.querySelector('button');

    addName.onclick = () => {
      const name = document.querySelector('input').value;
      if (name.length < 3) {
        this.add.text(
          config.width / 3.8,
          320,
          'Name should be over 3 characters!',
          {
            fontSize: '20px',
            fill: '#ff0000',
          },
        );
      } else {
        this.sys.game.globals.playerName = name;
        this.scene.stop('PlayerInput');
        this.scene.start('Game');
      }
    };
  }
}

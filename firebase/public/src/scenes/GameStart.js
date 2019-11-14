class GameStart extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameStart',
        });
    }

    create() {
        this.text = this.make.text();
        this.text.x = 400;
        this.text.y = 300;
        this.text.originX = 0.5;
        this.text.originY = 0.5;
        this.text.setText('Welcome!\n\n' +
            'Your task is to pilot a spaceship and avoid asteroids\n\n' +
            'The better you are at avoiding the asteroids,\nthe higher your score will be!\n\n' +
            'There are gaps in the asteroid belt that appear \neither near the top or bottom of the screen, \n' +
            'try to aim for these to make it through without getting hit\n\n' +
            'You can move the ship using the up and down arrow keys\n\n' +
            'When you reach the end of the game you will be asked to answer some questions\nbefore completing the task\n\n' +
            'Press space to begin!');
        this.text.setAlign('center');

        this.cache.game.n_trials = this.cache.game.trial_info.positions_A.length;

    }

    update() {

        var cursors = this.input.keyboard.createCursorKeys();

        if (cursors.space.isDown) {
            cursors.space.isDown = false;
            this.scene.start('GameScene', {score: this.scoreVal});
        }
    }


}

export default GameStart;
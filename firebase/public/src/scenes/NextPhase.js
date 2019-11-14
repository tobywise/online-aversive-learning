import GameOver from "./GameOver.js";

class NextPhase extends GameOver {

    constructor() {
        super({
            key: 'NextPhase',
        });
    }


    create() {
        this.cache.game.player_trial += 1
        this.text = this.make.text();
        this.text.x = 400;
        this.text.y = 300;
        this.text.originX = 0.5;
        this.text.originY = 0.5;
        this.text.setText('Game Over!\n\nYour score: ' + this.scoreVal + '\n\nTop score: ' + this.topScore +
            '\n\n\nPress space to play the next game');
        this.text.setAlign('center');
        this.saveData();

    }

    update() {

        var cursors = this.input.keyboard.createCursorKeys();

        if (cursors.space.isDown) {
            cursors.space.isDown = false;
            this.scene.start('AvoidanceStart', {score: this.scoreVal});
        }
    }

}

export default NextPhase;
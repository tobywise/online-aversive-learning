class AvoidanceStart extends Phaser.Scene {
    constructor() {
        super({
            key: 'AvoidanceStart',
        });
    }

    create() {
        this.text = this.make.text();
        this.text.x = 400;
        this.text.y = 300;
        this.text.originX = 0.5;
        this.text.originY = 0.5;
        this.text.setText('This next game is a little different to the previous one\n\n' +
            'This time, you will be faced with a group of asteroids flying towards you\n' +
            'and you will need to avoid these\n\n' +
            'The asteroids will always appear directly in front of your spaceship\n\n' +
            'Press space to begin!');
        this.text.setAlign('center');

        this.cache.game.n_trials = 30;
        this.cache.game.player_trial = 0;
        this.cache.game.trial = 0;

    }

    update() {

        var cursors = this.input.keyboard.createCursorKeys();

        if (cursors.space.isDown) {
            cursors.space.isDown = false;
            this.scene.start('AvoidanceScene', {score: this.scoreVal});
        }
    }

}

export default AvoidanceStart;
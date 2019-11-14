import GameScene from './/GameScene.js';

class AvoidanceScene extends GameScene {

    updateAsteroids() {

        this.hole = 0;
        this.hole2 = 0;

        var max_val = 0;
        this.last_asteroid = null;
        for (let i = 0; i < this.pipes.getChildren().length; i++) {
            var val = Phaser.Math.Between(800, 1000);
            if (i < 5) {
                var vv = this.ship.y;
                this.pipes.getChildren()[i].setX(val);
                this.pipes.getChildren()[i].setY(vv += (30 * (3 - i)));
                this.pipes.getChildren()[i].setVelocity(-1000, 0);
                if (val > max_val) {
                    max_val = val;
                    this.last_asteroid = this.pipes.getChildren()[i];
                }
            }
            else {
                this.pipes.getChildren()[i].setX(99999);

            }
        }

        this.cache.game.trial += 1;

    }

    addData() {

        var trialData = {};
        trialData.trial = this.cache.game.player_trial;
        trialData.trial_type = 'avoidance';
        trialData.player_y = this.ship.y;
        trialData.hole1_y = 0;
        trialData.hole2_y = 0;
        trialData.subjectID = this.cache.game.subjectID;
        trialData.score = this.scoreVal;
        trialData.health = this.ship.health;

        this.cache.game.data.push(trialData);

    }

    nextPhase() {

        var cursors = this.input.keyboard.createCursorKeys();
        cursors.up.isDown = false;
        cursors.down.isDown = false;

        this.ship.body = false;
        this.pipes.body = false;
        this.fire.body = false;
        this.space.body = false;

        if (!this.topScore) {
            this.topScore = this.scoreVal;
        }

        else if (this.scoreVal > this.topScore) {
            this.topScore = this.scoreVal;
        }

        this.scene.start('EndScene', {score: this.scoreVal, topScore: this.topScore});

    }

    gameOver() {

        var cursors = this.input.keyboard.createCursorKeys();
        cursors.up.isDown = false;
        cursors.down.isDown = false;


        if (!this.topScore) {
            this.topScore = this.scoreVal;
        }

        else if (this.scoreVal > this.topScore) {
            this.topScore = this.scoreVal;
        }

        this.scene.start('GameOver', {score: this.scoreVal, topScore: this.topScore, game: 'avoidance'});

    }

}

export default AvoidanceScene;
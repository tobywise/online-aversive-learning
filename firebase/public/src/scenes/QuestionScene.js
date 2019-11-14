class EndScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'QuestionScene',
        });
    }

    init(data) {
        console.log(data);
        this.scoreVal = data.score;
        this.topScore = data.topScore;
    }

    create() {
        this.text = this.make.text();
        this.text.x = 230;
        this.text.y = 250;
        this.text.setText('Questions');
        this.text.setAlign('center');
        // this.saveData(this.cache.game.subjectID + "_spaceship_game.json", JSON.stringify(this.cache.game.data));
        // this.text.setInteractive();

        // this.text.on('pointerup', function() {
        //     window.location.href = "https://app.prolific.ac/submissions/complete?cc=DCY6UA5M";
        // });
    }

    update() {

        var cursors = this.input.keyboard.createCursorKeys();

        if (cursors.space.isDown) {
            cursors.space.isDown = false;
            this.scene.start('GameScene', {score: this.scoreVal});
        }

    }

    saveData(filename, filedata) {
        $.ajax({
            type:'post',
            cache: false,
            url: '../write_data.php', // this is the path to the above PHP script
            data: {filename: filename, filedata: filedata}
        });
    }

}

export default EndScene;
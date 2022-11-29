import './phaser.min.js';
import GameStart from './scenes/GameStart.js';
import GameScene from './scenes/GameScene.js';
import GameOver from './scenes/GameOver.js';
import EndScene from './scenes/EndScene.js';
import AvoidanceStart from './scenes/AvoidanceStart.js';
import AvoidanceScene from './scenes/AvoidanceScene.js';
import NextPhase from './scenes/NextPhase.js';

var game = new GameScene('GameScene');
var avoidance = new AvoidanceScene('AvoidanceScene');
var gameover = new GameOver("GameOver");
var nextphase = new NextPhase("NextPhase");

let config = {
    type: Phaser.AUTO,
    parent: 'consent',
    width: 800,
    height: 600,
    scene: [
        GameStart,
        game,
        gameover,
        nextphase,
        AvoidanceStart,
        avoidance,
        EndScene
    ]
};

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

// // Firebase stuff - uncommment if using firebase
// firebase.firestore().enablePersistence()
// .catch(function(err) {
//     if (err.code == 'failed-precondition') {
//         // Multiple tabs open, persistence can only be enabled
//         // in one tab at a a time.
//         // ...
//     } else if (err.code == 'unimplemented') {
//         // The current browser does not support all of the
//         // features required to enable persistence
//         // ...
//     }
// });

// firebase.auth().signInAnonymously().catch(function(error) {
//     var errorCode = error.code;
//     var errorMessage = error.message;
// });

// var uid;
// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//     var isAnonymous = user.isAnonymous;
//     uid = user.uid;
//     } 
// });

// Consent form
var check_consent = function (elem) {
    // if ($('#consent_checkbox1').is(':checked') && $('#consent_checkbox2').is(':checked') &&
    //     $('#consent_checkbox3').is(':checked') && $('#consent_checkbox4').is(':checked') &&
    //     $('#consent_checkbox5').is(':checked') && $('#consent_checkbox6').is(':checked') &&
    //     $('#consent_checkbox7').is(':checked')) {
    if (1 == 1) {

        document.getElementById('consent').innerHTML = "";
        window.scrollTo(0,0);
        $.getJSON('./trial_info.json', function (data) {

            let game = new Phaser.Game(config);

            game.trial_info = data;
            game.trial = 0;
            game.player_trial = 0;
            if (window.location.search.indexOf('PROLIFIC_PID') > -1) {
                game.subjectID = getQueryVariable('PROLIFIC_PID');
            }
            else {
                game.subjectID = Math.floor(Math.random() * (2000000 - 0 + 1)) + 0; // if no prolific ID, generate random ID (for testing)
//                var subject_id = '0000' // for testing
            }

            game.data = {};
            game.n_trials = 0;

            game.dataKeys = ['health', 'hole1_y', 'hole2_y', 'player_y', 'score', 'subjectID', 'trial', 'trial_type'];


            // var db = firebase.firestore();
            game.dataKeys.forEach(k => {
                game.data[k] = [];
            });
            
            // Firebase stuff - uncomment if using firebase
            // db.collection("tasks").doc('spaceship_game').collection('subjects').doc(uid).set(game.data);
            
            // db.collection("tasks").doc('spaceship_game').collection('subjects').doc(uid).update({
            //     subjectID: game.subjectID,
            //     date: new Date().toLocaleDateString(),
            //     time: new Date().toLocaleTimeString()
            //   })

            // game.db = db;
            // game.uid = uid;

        });
        return true;
    }
    else {
        alert("Unfortunately you will not be unable to participate in this research study if you do " +
            "not consent to the above. Thank you for your time.");
        return false;
    }
};



document.getElementById('header_title').innerHTML = "Spaceship game";
document.getElementById('consent').innerHTML = "        <p><b>Consent</b><p>\n" +
    "        <p>\n" +
    "        <label class=\"container\">I agree that the research project named above has been explained to me to my\n" +
    "            satisfaction and I agree to take part in this study\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox7\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <br><br>\n" +
    "        <button type=\"button\" id=\"start\" class=\"submit_button\">Start Experiment</button>\n" +
    "        <br><br>";


document.getElementById("start").onclick = check_consent;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    alert("Sorry, this experiment does not work on mobile devices");
    document.getElementById('consent').innerHTML = "";
}

import './phaser.js';
import GameStart from './scenes/GameStart.js';
import GameScene from './scenes/GameScene.js';
import GameOver from './scenes/GameOver.js';
import EndScene from './scenes/EndScene.js';
import AvoidanceStart from './scenes/AvoidanceStart.js';
import AvoidanceScene from './scenes/AvoidanceScene.js';
import NextPhase from './scenes/NextPhase.js';

Sentry.init({ dsn: 'https://858581c7c8234dd393241da13da4f94b@sentry.io/1340805' });

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

// Firebase stuff
firebase.firestore().enablePersistence()
.catch(function(err) {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
    }
});

firebase.auth().signInAnonymously().catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
});

var uid;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    var isAnonymous = user.isAnonymous;
    uid = user.uid;
    } 
});

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


            var db = firebase.firestore();
            game.dataKeys.forEach(k => {
                game.data[k] = [];
            });

            db.collection("tasks").doc('spaceship_game').collection('subjects').doc(uid).set(game.data);
            
            db.collection("tasks").doc('spaceship_game').collection('subjects').doc(uid).update({
                subjectID: game.subjectID,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
              })


            game.db = db;
            game.uid = uid;

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
document.getElementById('consent').innerHTML = "        <p><b>Who is conducting this research study?</b><p>\n" +
    "        <p>\n" +
    "        This research is being conducted by the Wellcome Centre for Human Neuroimaging and the Max Planck UCL Centre\n" +
    "        for Computational Psychiatry and Ageing Research. The lead researcher(s) for this project is\n" +
    "        <a href=\"mailto:t.wise@ucl.ac.uk\">Dr Toby Wise</a>. This study has been approved by the UCL Research Ethics Committee\n" +
    "        (project ID number 9929/003) and funded by the Wellcome Trust.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>What is the purpose of this study?</b><p>\n" +
    "        <p>\n" +
    "        We are interested in how the adult brain controls learning and decision-making. This research aims to provide\n" +
    "        insights into how the healthy brain works to help us understand the causes of a number of different medical\n" +
    "        conditions.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>Who can participate in the study?</b><p>\n" +
    "        <p>\n" +
    "            You must be 18 or over to participate in this study. Please confirm this to proceed.\n" +
    "        </p>\n" +
    "            <label class=\"container\">I confirm I am over 18 years old\n" +
    "                <input type=\"checkbox\" id=\"consent_checkbox1\">\n" +
    "                <span class=\"checkmark\"></span>\n" +
    "            </label>\n" +
    "        <br>\n" +
    "\n" +
    "        <p><b>What will happen to me if I take part?</b><p>\n" +
    "        <p>\n" +
    "            You will play one or more online computer games, which will last approximately 30-40 minutes. You " +
    "will receive\n" +
    "            at least £5 per hour for helping us.\n" +
    "            You will also be asked some questions about yourself, your feelings, background, attitudes and behaviour in your everyday life.\n" +
    "            Remember, you are free to withdraw at any time without giving a reason.\n\n" +
    "            We would like to understand how learning and decision-making change with time.  After you " +
    "complete this experiment we may invite you to participate again 2 or 3 times. You will be compensated after " +
    "completion of each session at a rate of at least £5 per hour.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>What are the possible disadvantages and risks of taking part?</b><p>\n" +
    "        <p>\n" +
    "            The task will you complete does not pose any known risks.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>What are the possible benefits of taking part?</b><p>\n" +
    "        <p>\n" +
    "            While there are no immediate benefits to taking part, your participation in this research will help us\n" +
    "        understand how people make decisions and this could have benefits for our understanding of mental health problems.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>Complaints</b><p>\n" +
    "        <p>\n" +
    "        If you wish to complain or have any concerns about any aspect of the way you have been approached or treated\n" +
    "        by members of staff, then the research UCL complaints mechanisms are available to you. In the first instance,\n" +
    "        please talk to the <a href=\"mailto:t.wise@ucl.ac.uk\">researcher</a> or the chief investigator\n" +
    "        (<a href=\"mailto:r.dolan@ucl.ac.uk\">Professor Ray Dolan</a>) about your\n" +
    "        complaint. If you feel that the complaint has not been resolved satisfactorily, please contact the chair of\n" +
    "        the <a href=\"mailto:ethics@ucl.ac.uk\">UCL Research Ethics Committee</a>.\n" +
    "\n" +
    "        If you are concerned about how your personal data are being processed please contact the data controller\n" +
    "        who is <a href=\"mailto:protection@ucl.ac.uk\">UCL</a>.\n" +
    "        If you remain unsatisfied, you may wish to contact the Information Commissioner’s Office (ICO).\n" +
    "        Contact details, and details of data subject rights, are available on the\n" +
    "        <a href=\"https://ico.org.uk/for-organisations/data-protection-reform/overview-of-the-gdpr/individuals-rights\">ICO website</a>.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>What about my data?</b><p>\n" +
    "        <p>\n" +
    "            To help future research and make the best use of the research data you have given us (such as answers\n" +
    "        to questionnaires) we may keep your research data indefinitely and share these.  The data we collect will\n" +
    "        be shared and held as follows:\n" +
    "            •\tIn publications, your data will be anonymised, so you cannot be identified.\n" +
    "            •\tIn public databases, your data will be anonymised\n" +
    "\n" +
    "        If there are any queries or concerns please do not hesitate to contact <a href=\"mailto:t.wise@ucl.ac.uk\">Dr Toby Wise</a>.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>If you are happy to proceed please read the statement below and click the boxes to show that you\n" +
    "            consent to this study proceeding</b><p>\n" +
    "\n" +
    "        <label class=\"container\">I have read the information above, and understand what the study involves.\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox2\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <label class=\"container\">I understand that my anonymised/pseudonymised personal data can be shared with others\n" +
    "            for future research, shared in public databases and in scientific reports.\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox3\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <label class=\"container\">I understand that I am free to withdraw from this study at any time without\n" +
    "            giving a reason and this will not affect my future medical care or legal rights.\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox4\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <label class=\"container\">I understand the potential benefits and risks of participating, the support available\n" +
    "            to me should I become distressed during the research, and who to contact if I wish to lodge a complaint.\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox5\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <label class=\"container\">I understand the inclusion and exclusion criteria in the Information Sheet.\n" +
    "            I confirm that I do not fall under the exclusion criteria.\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox6\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
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


// TODO PUT ALL OF THIS IN ENDSCENE
import { ServerManager } from '../lib/core-3.0.0b3.js';

async function saveData(q_data)
{

    console.log(q_data);
    // Use psychoJS saving
    var serverManager = new ServerManager;
    // var serverManager = {};
    serverManager._psychoJS = {config: {psychoJsManager: {URL: 'https://pavlovia.org/server'},
            experiment: {name: 'spaceship_game', fullpath: 'tobywise/spaceship-game'},
            gitlab: {projectId: 1197}},
        logger: {debug: function debug(text) {
                var a = 1;
            }}
    };
    //
    const response = serverManager.getConfiguration('config.json');
    this._config = response.config;


    if (window.location.search.indexOf('PROLIFIC_PID') > -1) {
        var subjectID = getQueryVariable('PROLIFIC_PID');
    }
    else {
        var subjectID = Math.floor(Math.random() * (2000000 - 0 + 1)) + 0; // if no prolific ID, generate random ID (for testing)
    }


    var csv = "";

    var header = ['subjectID', 'question_id', 'value'];

    var d = new Date();
    var key = 'questionnaires_' + subjectID + '_' + d.getDate() + d.getMonth() + d.getFullYear();

    for (var h = 0; h < header.length; h++) {
        if (h > 0)
            csv = csv + ', ';
        csv = csv + header[h];
    }
    csv = csv + '\n';
    for (var r = 0; r < q_data; r++) {
        for (var h = 0; h < header.length; h++) {
            if (h > 0)
                csv = csv + ', ';
            csv = csv + q_data[r][header[h]];
        }
        csv = csv + '\n';
    }

    console.log(csv);

    var a = await serverManager.uploadData(key+'.csv', csv);
    return a

}

function createQuestion(questionnaireName, questionData) {


    var f = document.createElement("form");
    f.setAttribute('method',"post");
    //    f.setAttribute('action',"submit.php");
    f.setAttribute('id', questionnaireName.concat('_' + questionData.qNumber.toString()));
    f.setAttribute("name", "form_");

    var fieldset = document.createElement("fieldset");
    fieldset.setAttribute("class", "form__options");
    fieldset.setAttribute('id', questionnaireName.concat('_' + questionData.qNumber.toString()));
    fieldset.setAttribute("name", "fs_");

    var legend = document.createElement("legend");
    legend.setAttribute("class", "form__question");
    legend.setAttribute("name", "legend");
    legend.append(questionData.prompt);

    fieldset.appendChild(legend);

    var labels = [];

    for (i = 0; i < questionData.labels.length; i++) {

        var p = document.createElement("p");
        p.setAttribute('class', 'form__answer');
        var c = document.createElement("input");
        c.type = "radio";
        c.id = questionnaireName.concat(questionData.qNumber.toString()).concat("answer".concat(i.toString()));
        c.name = "question";
        c.value = i;

        var l = document.createElement("label");
        l.setAttribute('for', c.id);
        l.append(questionData.labels[i]);

        p.appendChild(c);
        p.appendChild(l);

        labels.push(p);

        fieldset.appendChild(p)

    }

    f.appendChild(fieldset);


    return f;

}


function createPreamble(preamble) {

    var h = document.createElement("header");
    h.setAttribute("class", "form__header");
    h.setAttribute("name", "fs_");

    var p = document.createElement("p");
    p.setAttribute("class", "preamble");

    var div = document.createElement("div");
    div.innerHTML = preamble;

    p.appendChild(div);
    h.appendChild(p);

    return h

}


function createQuestionnaire(questionnaireData) {

    var preamble = createPreamble(questionnaireData.preamble);

    document.getElementById('questionnaires').appendChild(preamble);

    for (j = 0; j < questionnaireData.questions.length; j++) {

        questionnaireData.questions[j].qNumber = j;

        if (j < questionnaireData.questions.length - 1) {
            next = questionnaireData.name.concat((j+1).toString());
        }

        document.getElementById('questionnaires').appendChild(createQuestion(questionnaireData.name,
            questionnaireData.questions[j], next));

    }

}

function createDemographics() {

    var preamble = createPreamble("First, we need some information about you");

    document.getElementById('questionnaires').appendChild(preamble);


    // Sex
    qDataSex = {
        qNumber: 0,
        prompt: "What is your sex?",
        labels: ['Male', 'Female']
    };

    sexQuestion = createQuestion('Sex', qDataSex);
    document.getElementById('questionnaires').appendChild(sexQuestion);


    // Age
    var ageForm = document.createElement("form");
    ageForm.setAttribute('method',"post");
    ageForm.setAttribute('id', "age");
    ageForm.setAttribute("name", "form_");

    var ageFieldSet = document.createElement("fieldset");
    ageFieldSet.setAttribute("class", "form__options");
    ageFieldSet.setAttribute('id', "age");
    ageFieldSet.setAttribute("name", "fs_");

    var legendAge = document.createElement("legend");
    legendAge.setAttribute("class", "questionDemo");
    legendAge.append("How old are you?");
    legendAge.setAttribute("name", "legend");
    legendAge.name = 'question';

    ageFieldSet.appendChild(legendAge);

    var box = document.createElement("input");
    box.setAttribute("class", "textEntry");
    box.setAttribute("type", "text");
    box.setAttribute("id", "Age");
    box.name = 'question';

    ageFieldSet.appendChild(box);

    ageForm.appendChild(ageFieldSet);
    document.getElementById('questionnaires').appendChild(ageForm);

    // Asteroid unpleasantness
    var shockForm = document.createElement("form");
    shockForm.setAttribute('method',"post");
    shockForm.setAttribute('id', "age");
    shockForm.setAttribute("name", "form_");

    var shockFieldSet = document.createElement("fieldset");
    shockFieldSet.setAttribute("class", "form__options");
    shockFieldSet.setAttribute('id', "shock_rating");
    shockFieldSet.setAttribute("name", "fs_");

    var legendShock = document.createElement("legend");
    legendShock.setAttribute("class", "questionDemo");
    legendShock.setAttribute("name", "legend");
    legendShock.innerHTML = "<p>How much did you want to avoid the asteroids?</p>" +
        "<p><span class='small_text'>(0 = not at all, 100 = a lot)</span></p>";

    shockFieldSet.appendChild(legendShock);

    var sliderBox = document.createElement("div");
    sliderBox.setAttribute("class", "slidecontainer");

    var slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", "0");
    slider.setAttribute("max", "100");
    slider.setAttribute("class", "slider");
    slider.setAttribute("id", "shockUnpleasantness");
    slider.name = 'question';

    var sliderLabelLeft = document.createElement("p");
    sliderLabelLeft.setAttribute("class", "sliderLabel");
    sliderLabelLeft.append("0");
    var sliderLabelRight = document.createElement("p");
    sliderLabelRight.setAttribute("class", "sliderLabel");
    sliderLabelRight.append("100");

    sliderBox.appendChild(sliderLabelLeft);
    sliderBox.appendChild(slider);
    sliderBox.appendChild(sliderLabelRight);

    shockFieldSet.appendChild(sliderBox);

    shockForm.appendChild(shockFieldSet);

    // Asteroid anxiety
    var anxietyForm = document.createElement("form");
    anxietyForm.setAttribute('method',"post");
    anxietyForm.setAttribute('id', "anxietySlider");
    anxietyForm.setAttribute("name", "form_");

    var anxietyFieldSet = document.createElement("fieldset");
    anxietyFieldSet.setAttribute("class", "form__options");
    anxietyFieldSet.setAttribute('id', "anxiety_rating");
    anxietyFieldSet.setAttribute("name", "fs_");

    var legendAnxiety = document.createElement("legend");
    legendAnxiety.setAttribute("class", "questionDemo");
    legendAnxiety.setAttribute("name", "legend");
    legendAnxiety.innerHTML = "<p>How anxious did the game make you feel?</p>" +
        "<p><span class='small_text'>(0 = not at all anxious, 100 = very anxious)</span></p>";

    anxietyFieldSet.appendChild(legendAnxiety);

    var anxietySliderBox = document.createElement("div");
    anxietySliderBox.setAttribute("class", "slidecontainer");

    var anxietySlider = document.createElement("input");
    anxietySlider.setAttribute("type", "range");
    anxietySlider.setAttribute("min", "0");
    anxietySlider.setAttribute("max", "100");
    anxietySlider.setAttribute("class", "slider");
    anxietySlider.setAttribute("id", "anxietyAsteroids");
    anxietySlider.name = 'question';

    var anxietySliderLabelLeft = document.createElement("p");
    anxietySliderLabelLeft.setAttribute("class", "sliderLabel");
    anxietySliderLabelLeft.append("0");
    var anxietySliderLabelRight = document.createElement("p");
    anxietySliderLabelRight.setAttribute("class", "sliderLabel");
    anxietySliderLabelRight.append("100");

    anxietySliderBox.appendChild(anxietySliderLabelLeft);
    anxietySliderBox.appendChild(anxietySlider);
    anxietySliderBox.appendChild(anxietySliderLabelRight);

    anxietyFieldSet.appendChild(anxietySliderBox);

    anxietyForm.appendChild(anxietyFieldSet);

    document.getElementById('questionnaires').appendChild(shockForm);
    document.getElementById('questionnaires').appendChild(anxietyForm);

}

function getValues() {

    // get values
    var inputs = document.getElementsByName("fs_");
    console.log(inputs);

    if (window.location.search.indexOf('PROLIFIC_PID') > -1) {
        var subjectID = getQueryVariable('PROLIFIC_PID');
    }
    else {
        var subjectID = Math.floor(Math.random() * (2000000 - 0 + 1)) + 0; // if no prolific ID, generate random ID (for testing)
    }

    values = {};
    incomplete = [];
    q_data = [];

    for (i = 0; i < inputs.length; i++) {

        var q_values = {};
        q_values.subjectID = subjectID;

        if (inputs[i].id.length > 0) {

            id = inputs[i].id;
            q_values.question_id = id;
            legend = inputs[i].querySelectorAll('[name="legend"]')[0];

            checked = inputs[i].querySelector('input[name="question"]:checked');

            if (checked != null) {
                legend.style.color = "#000000";
                value = checked.value;
                values[id] = value;
                q_values.value = value;
            }

            else if (inputs[i].querySelector('input[type="text"]')) {

                value = inputs[i].querySelector('input[type="text"]').value;
                if (value.length == 0) {

                    legend.style.color = "#ff0000";
                    incomplete.push(id);
                }

                else {
                    legend.style.color = "#000000";
                    if (id == 'subjectID') {
                        var subjectID = value;
                    }
                    values[id] = value;
                    q_values.value = value;
                }
            }

            else if (inputs[i].querySelector('input[type="range"]')) {
                value = inputs[i].querySelector('input[type="range"]').value;
                values[id] = value;
                q_values.value = value;

            }

            else {
                legend.style.color = "#ff0000";
                incomplete.push(id);
            }
        }
        q_data.push(q_values);

    }


    if (incomplete.length > 0) {
        $('html, body').animate({
            scrollTop: $(document.getElementById(incomplete[0])).offset().top - 100
        }, 400);
    }

    else {
        var valuesAsJSON = JSON.stringify(values);
        saveData(q_data);
    }

}


function createSubjectID() {


    var subjectIDForm = document.createElement("form");
    subjectIDForm.setAttribute('method',"post");
    subjectIDForm.setAttribute('id', "SubjectID");

    var subjectIDFieldSet = document.createElement("fieldset");
    subjectIDFieldSet.setAttribute("class", "form__options");
    subjectIDFieldSet.setAttribute('id', "subjectID");
    subjectIDFieldSet.setAttribute("name", "fs_");

    var legendShock = document.createElement("legend");
    legendShock.setAttribute("class", "questionDemo");
    legendShock.setAttribute("name", "legend");
    legendShock.innerHTML = "Enter subject ID";

    var boxSubjectID = document.createElement("input");
    boxSubjectID.setAttribute("class", "textEntry");
    boxSubjectID.setAttribute("type", "text");
    boxSubjectID.setAttribute("id", "SubjectID");


    var submitSubjectID = document.createElement('button');
    submitSubjectID.setAttribute("class", "submit_button");
    submitSubjectID.setAttribute("type", "button");
    submitSubjectID.setAttribute("id", "subjectIDSubmit");
    submitSubjectID.append("OK");

    subjectIDFieldSet.appendChild(legendShock);
    subjectIDFieldSet.appendChild(boxSubjectID);
    subjectIDFieldSet.appendChild(submitSubjectID);
    subjectIDForm.appendChild(subjectIDFieldSet);

    document.getElementById('subjectID').appendChild(subjectIDForm);

}

// Load questionnaires

$.getJSON('questionnaires_json_meg.txt', function (data) {
    console.log("AAA");
    var questionnaire_data = data;

    createDemographics();

    var qs = questionnaire_data.keys();
    console.log(qs);
    qs = Phaser.ArrayUtils.shuffle(qs);
    console.log(qs);

    createQuestionnaire(questionnaire_data.STICSA_S);
    createQuestionnaire(questionnaire_data.STICSA_T);
    createQuestionnaire(questionnaire_data.PSWQ);
    createQuestionnaire(questionnaire_data.BDI);
    createQuestionnaire(questionnaire_data.RRS);


    var forms = document.getElementsByName("fs_");

    for (i = 5; i < forms.length; i++) {

        // Generate function to scroll to next question if we're not on the last question

        if (i < forms.length - 1) {

            forms[i].setAttribute("scrollPos", $(forms[i + 1]).offset().top - 100);

            $(forms[i]).children().children().click(function () {
                $('html, body').animate({
                    scrollTop: $(this).parent().parent().attr("scrollPos")
                }, 400);
            });
        }
    }

    var submit = document.createElement('button');
    submit.setAttribute("class", "submit_button");
    submit.setAttribute("type", "button");
    submit.setAttribute("id", "submit");
    submit.append("Complete task");

    var submit_form = document.createElement("form");
    submit_form.setAttribute("class", "submitContainer");

    submit_form.appendChild(submit);

    document.getElementById('questionnaires').appendChild(submit_form);

    document.getElementById('submit').onclick = getValues;

    function scrollToQuestions() {
        var value = this.parentNode.querySelector('input[type="text"]').value;
        if (value.length > 0) {
            $('html, body').animate({
                scrollTop: $(document.getElementById("header")).offset().top - 100
            }, 400);
        }

        else {
            var legend = this.parentNode.querySelectorAll('[name="legend"]')[0];
            legend.style.color = "#ff0000";
        }
    }



//        forms[forms.length - 1].appendChild(submit);


});

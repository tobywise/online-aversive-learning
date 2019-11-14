
# **Associations between aversive learning processes and transdiagnostic psychiatric symptoms revealed by large-scale phenotyping**

Toby Wise & Raymond J. Dolan

_BioRxiv_, 2019


## Code

Analyses for this project are contained within Jupyter notebooks (in the `/notebooks` directory). Python 2.7 was used for all these analysese, and the code will most likely not run smoothly with Python 3.

All the main analyis is run in Jupyter notebooks, and these notebooks make use of scripts located in the `/code` directory along with standard Python packages (e.g. numpy, pandas, matplotlib etc).

In addition, they require a package called [DMPy](https://github.com/tobywise/DMpy/tree/baf71241a1ecff20a3908c99ec236e7a06c49474) (this package is half-written and doesn't have much functionality beyond that required for this project).

## Notebooks

The majority of the analysis reported in the paper is run in a series of Jupyter notebooks, which are located in the `/notebooks` directory. The only exception is the fitting of behavioural models, which was run on a HPC cluster for speed (code for this model fitting is provided in the `/code` directory).

There are 4 notebooks, each of which runs a specific section of the analysis pipeline and produces all the figures etc. associated with it.

### 1. Task data preprocessing (`preprocessing.ipynb`)

This data takes the raw data from the task and extracts the behavioural variables of interest. This notebook is parameterised through [Papermill](https://papermill.readthedocs.io/) and is run for each subject individually. The script to run this is in the `code` directory, and the output notebooks for every subject are provided in the `/notebooks/preprocessing` directory.

### 2. Questionnaire analysis (`questionnaire_analysis.ipynb`)

This notebook processes our questionnaire measures, and calculates scores on three transdiagnostic factors.

### 3. Behavioural analyses and model fitting (`behavioural_analysis.ipynb`)

This notebooks performs analyses looking at how attention affects learning.

### 4. Analyses relating behaviour to psychopathology (`psychopathology_analysis.ipynb`)

This notebook runs regression analyses examining relationships between questionnaire measures and behavioural variables.

## Task

![url](https://raw.githubusercontent.com/tobywise/tobywise.github.io/master/img/game_example.gif "The spaceship game")

_The game used to examine aversive learning processes online_

Code for the task is provided in `/firebase/public/`. The task is coded in JavaScript, mainly using the [Phaser 3](https://phaser.io/phaser3) game development framework.

A demo of the task can be found [here](https://tw-spaceship-game.firebaseapp.com/).

## Data

All data is available on the Open Science Framework [here](https://osf.io/b95w2/).

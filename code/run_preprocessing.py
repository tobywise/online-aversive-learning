import papermill as pm
import os
import re
import pandas as pd
from tqdm import tqdm

# Parameters
first_sample = 3
last_sample = 5
behaviour_path = 'Data/raw_data/task'

# Find files
behaviour_files = [i for i in os.listdir(behaviour_path) if 'csv' in i and 'game_data' in i]

# Run preprocessing for each subject and save output notebooks
for f in tqdm(behaviour_files):
    pm.execute_notebook(
        r'notebooks/preprocess_data.ipynb',
        r'notebooks/preprocessing/preprocess_data_{0}.ipynb'.format(re.search('(?<=data_).+(?=_)', f).group()),
        kernel_name='attention',
        parameters=dict(first_sample=first_sample,
                        last_sample=last_sample,
                        behaviour_path=behaviour_path,
                        behaviour_file=f),
        progress_bar=False
    )

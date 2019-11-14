import sys
sys.path.insert(0, 'code')
import dill
import re
import matplotlib.pyplot as plt
import numpy as np
import theano.tensor as T
import json
import os
from DMpy import DMModel, Parameter
from DMpy.utils import beta_response_transform
from DMpy.observation import softmax
import pandas as pd
import copy
from learning_models import *
import pymc3 as pm

import argparse

class thing():

    def __init__(self):
        self.a = ''

args = thing()
args.model_instance = 'Data/models/ALB.pkl'

# if __name__ == '__main__':

# parser = argparse.ArgumentParser()
# parser.add_argument("model_instance")
# args = parser.parse_args()

with open(args.model_instance, 'rb') as f:
    model = dill.load(f)

with open('Data/models_old/ALB_fit.pklz', 'rb') as f:
    model_old = dill.load(f)

import pandas as pd
aa = pd.read_csv(os.path.join('Data/modelling_data', 'combined_modelling_data_old.csv'))
aa['Response'][aa['Response'].isnull()] = 0
aa['Outcome'][aa['Outcome'].isnull()] = 0
aa['Outcome_2'][aa['Outcome_2'].isnull()] = 0

print("FITTING {0}".format(model.name))
model.fit(aa.copy(), model_inputs=['Outcome_2'],
            response_transform=beta_response_transform, fit_method='variational', fit_kwargs={'n': 40000},
            hierarchical=True, plot=False, suppress_table=True, fit_stats=True)

with open(args.model_instance.replace('.pkl', '_fit.pklz'), 'wb') as f:
    dill.dump(model, f)

    print "MODEL FITTING FINISHED"



print("FITTING {0}".format(model.name))
model.fit(os.path.join('Data/modelling_data', 'combined_modelling_data.csv'), model_inputs=['Outcome_2'],
            response_transform=beta_response_transform, fit_method='variational', fit_kwargs={'n': 40000},
            hierarchical=True, plot=False, suppress_table=True, fit_stats=True)

for p in model.learning_parameters:
    print(p.mean, p.variance, p.dynamic, p.lower_bound, p.upper_bound, p.fixed, p.name)

print("######")
for p in model_old.learning_parameters:
    print(p.mean, p.variance, p.dynamic, p.lower_bound, p.upper_bound, p.fixed, p.name)

model.learning_model    


model.learning_model.__code__.co_code == model_old.learning_model.__code__.co_code


import copy

with open(args.model_instance, 'rb') as f:
    model = dill.load(f)

with open('Data/models_old/ALB_fit.pklz', 'rb') as f:
    model_old = dill.load(f)

# model_old.responses = copy.deepcopy(model.responses)
# model_old._pymc3_model = None

print("FITTING {0}".format(model.name))
model.fit(os.path.join('Data/modelling_data', 'combined_modelling_data_old.csv'), model_inputs=['Outcome_2'],
            response_transform=beta_response_transform, fit_method='variational', fit_kwargs={'n': 40000},
            hierarchical=True, plot=False, suppress_table=True, fit_stats=True)



with open('Data/models_old/ALB_fit.pklz', 'rb') as f:
    model_old = dill.load(f)
    
model_old._pymc3_model = None

print("FITTING {0}".format(model.name))
model_old.fit(os.path.join('Data/modelling_data', 'combined_modelling_data_old.csv'), model_inputs=['Outcome_2'],
            response_transform=beta_response_transform, fit_method='variational', fit_kwargs={'n': 40000},
            hierarchical=True, plot=False, suppress_table=True, fit_stats=True)
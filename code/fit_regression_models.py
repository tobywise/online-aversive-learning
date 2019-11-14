import os
import subprocess

model_dir = 'Data/regression_models/models'
models = os.listdir(model_dir)

for model in models:
    print(model)
    with open('code/models_list.txt', 'a+') as f:
        f.write(os.path.join(model_dir, model) + '\n')

print('qsub '+ '-t 1-{0} '.format(len(models)) + 'code/fit_regression_model.sh')
subprocess.call('qsub '+ '-t 1-{0} '.format(len(models)) + 'code/fit_regression_model.sh', shell=True)

print("DONE")
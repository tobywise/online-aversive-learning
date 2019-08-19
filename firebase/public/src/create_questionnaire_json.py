import json
import pandas as pd
import re
import io

questionnaire_data = pd.read_csv('questionnaires/questionnaires_info.csv')

data = {}

for i in questionnaire_data.Measure.unique():
    data[i] = dict(questions=[], preamble=questionnaire_data.Preamble[questionnaire_data.Measure == i].iloc[0],
                   name=i)
    for j in questionnaire_data[questionnaire_data.Measure == i].iterrows():
        j[1].Options = j[1].Options.replace('.,', '..,')
        data[i]['questions'].append(dict(prompt=j[1].Question,
                                         labels=[k.replace(',', '').replace('.', '')
                                                  for k in re.compile(',(?=[A-Za-z0-9])').split(j[1].Options)],
                                         question_id=j[1].id,
                                         reverse_coded=j[1].ReverseCoded))

json_data = json.dumps(data, ensure_ascii=False)

with io.open('html/questionnaires_json.txt', 'w', encoding='utf8') as outfile:
    outfile.write(unicode(json_data))


import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
import os
os.chdir(r'C:\Users\vu86683\Desktop\hackathon')







#
#Xtrain, Ytrain, Xtest, Ytest = train_test_split(X, Y, test_size=0.2)
#dm_train = xgb.DMatrix(Xtrain, Ytrain)
#dm_test = xgb.DMatrix(Xtest, None)
#
#params = {'n_estimators': 100, 
#          'booster': 'gbtree',
#          'objective': 'reg:linear',
#          'eval_metric': 'rmse',
#          'max_depth': 2,
#          'eta': 0.1}
#
#mdl2 = xgb.train(params=params, 
#                dtrain=dm_train, 
#                num_boost_round=100)
#
#Y_pred_train = mdl2.predict(dm_train)
#Y_pred_test = mdl2.predict(dm_test)
#
######
#

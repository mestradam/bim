import numpy as np
import pandas as pd
from convertbng.util import convert_bng

def split_coor(frame, col, delim=' '):
    """ 
    split the coordinate in form of <x y>. Type is string
    """
    return frame[col].str.split(delim, expand=True)

def clean_coordinates(frame, mode='link'):
    if mode == 'link':
        frame[['fromX', 'fromY']] = split_coor(frame, 'from')
        frame[['toX', 'toY']] = split_coor(frame, 'to')
        frame.drop(['from', 'to'], axis=1, inplace=True)
    if mode == 'node':
        frame[['X', 'Y']] = split_coor(frame, 'location').astype(float)
        frame.drop('location', axis=1, inplace=True)
    return frame

def convert_dtypes(frame, col_list):
    frame[col_list] = frame[col_list].astype(float)
    return frame

def impute_depth(frame):
    for col in ['UpDepth', 'DownDepth']:
        frame[col] = frame[col]\
                        .fillna(frame['ReviewDept'])
    
    frame['UpDepth'] = frame['UpDepth'].fillna(frame['InvertDept_up']/2)
    frame['DownDepth'] = frame['DownDepth'].fillna(frame['InvertDept_down']/2)
    
    frame['UpDepth'] = frame['UpDepth'].fillna(frame['DownDepth'])
    frame['DownDepth'] = frame['DownDepth'].fillna(frame['UpDepth'])
    
    frame = frame.dropna(subset = ['UpDepth', 'DownDepth'], how='all')
    frame = frame.drop(['InvertDept_up', 'InvertDept_down'], axis=1)
    return frame

def impute_height(frame):
    frame['Height'] = frame['Height'].fillna(frame['ReviewDiam'])
    
    mat = frame\
            .groupby(['Material', 'SewerUsage'], as_index=False)\
            .agg({'Height': np.nanmean})\
            .rename(columns={'Height':'mat_usage_avg'})
    
    mat2 = frame\
            .groupby(['Material'], as_index=False)\
            .agg({'Height': np.nanmean})\
            .rename(columns={'Height':'mat_avg'})
            
    frame = frame\
            .merge(mat, on=['Material', 'SewerUsage'])\
            .merge(mat2, on=['Material'])
        
    frame['Height'] = frame['Height']\
                        .fillna(frame['mat_usage_avg'])\
                        .fillna(frame['mat_avg'])
                        
    frame = frame.drop(['mat_usage_avg', 'mat_avg'], axis=1)
    return frame

def merge_nodes(frame, nodes):
    frame = frame\
            .merge(
                    nodes, 
                    how='left', 
                    left_on='UpNode', 
                    right_on='NodeRefere')\
            .drop(
                    'NodeRefere', 
                    axis=1)\
            .merge(
                    nodes, 
                    how='left', 
                    left_on='DownNode', 
                    right_on='NodeRefere', 
                    suffixes=('_up', '_down'))\
            .drop(
                    'NodeRefere', 
                    axis=1)
    
    return frame

def interpolate(frame):
    
    selected_cols = [*frame.columns]
    remove_cols = ['fromX', 'fromY', 'toX', 'toY']
    
    for x in remove_cols:
        selected_cols.remove(x)
    
    frame_list = []
    
    for i, row in frame.iterrows():    
        Xs = np.linspace(
                start=float(row['fromX']), 
                stop=float(row['toX']), 
                num=int(row['length_m'])
                )
        
        Ys = np.linspace(
                start=float(row['fromY']), 
                stop=float(row['toY']), 
                num=int(row['length_m'])
                )
        
        x = pd.DataFrame(np.array([Xs, Ys]).T)
        x.index = [i]*len(x)
        
        frame_list.append(x)
    
    points = pd.concat(frame_list)
    points.columns = ['X', 'Y']
    points[selected_cols] = frame[selected_cols].copy()
    points = points.reset_index(drop=True)
    
    return points 

def compute_elevation_pipe(frame):
    frame['elevation_up'] = frame['CoverLevel_up'] - frame['UpDepth'] + frame['Height']
    frame['elevation_down'] = frame['CoverLevel_down'] - frame['DownDepth'] + frame['Height']
    
    return frame

def compute_elevation_point(points):
    points['from_X_up'] = np.abs(points['X'] - points['X_up'])
    points['from_X_down'] = np.abs(points['X_down'] - points['X'])
    points['pct_from_X_up'] = points['from_X_up'] / points[['from_X_up', 'from_X_down']].sum(axis=1)
    points['elevation'] = points['elevation_up'] * (1-points['pct_from_X_up'])\
                        + points['elevation_down'] * (points['pct_from_X_up'])
                        
    points['CoverLevel'] = points['CoverLevel_up'] * (1-points['pct_from_X_up'])\
                        + points['CoverLevel_down'] * (points['pct_from_X_up']) 
                        
    points['depth'] = points['CoverLevel'] - points['elevation']
    
    points = points.drop(['from_X_up', 'from_X_down', 'pct_from_X_up'], axis=1)
    
    return points

def get_nearest_in_area(X, Y, points, radius=10, n_points=10, latlon=True, json_output=True):
    if latlon == True:
        result = convert_bng(X, Y)
        X, Y = [elem[0] for elem in result]
    
    cond = (points['X'] < X + radius)\
             & (points['X'] > X - radius)\
             & (points['Y'] < Y + radius)\
             & (points['Y'] > Y - radius)
             
    in_radius = points[cond].copy()
    in_radius['distance'] = np.sqrt((in_radius['X'] - X)**2 + (in_radius['Y'] - Y)**2)
    selected = in_radius.sort_values('distance').head(n_points)
    
    selected = selected[['ID', 'X', 'Y', 'distance', 'elevation', 'SewerUsage']]
#    
    if json_output:
        selected = selected.to_json(orient='records')
        
    return selected
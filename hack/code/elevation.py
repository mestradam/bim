import requests
import json

# Magic value that turned out unhelpful
_key = 'dMJ4SZIacq347OZlBNR1t99g1-V4Ul'
# _url = 'https://elevation-api.io/api/elevation?key=%s&resolution=%s&points=(%f,%f)'
_url = 'https://elevation-api.io/api/elevation?resolution=%s&points=(%f,%f)'
_defaultResolution = '10'

def queryElevationApi (latitude, longitude, resolution=None, verbose=False):

    # fmtUrl = _url % (_key, resolution or _defaultResolution, latitude, longitude)
    fmtUrl = _url % (resolution or _defaultResolution, latitude, longitude)

    if verbose:
        print("Querying", fmtUrl)
    response = requests.get(fmtUrl)

    if verbose:
        print(response)
    return response

def getElevation (latitude, longitude, resolution=None, verbose=False):
    return json.loads(queryElevationApi(latitude,longitude,resolution,verbose).text)['elevations'][0]['elevation']

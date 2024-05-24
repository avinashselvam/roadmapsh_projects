from flask import Flask, request
from flask_caching import Cache
from flask_cors import CORS
import requests
from requests import HTTPError
from datetime import datetime
import os
import redis

app = Flask(__name__)

app.config['CACHE_TYPE'] = 'redis'
app.config['CACHE_REDIS_HOST'] = 'localhost'
app.config['CACHE_REDIS_PORT'] = 6379
app.config['CACHE_REDIS_DB'] = 0

cache = Cache(app)
cache.init_app(app)

redis_client = redis.Redis(host='localhost', port=6379, db=0)

CORS(app)

API_KEY = os.environ.get('API_KEY')

def get_cache_key():
    pincode = request.args.get('pincode')
    return f'pincode_{pincode}'

@app.get("/weather")
@cache.cached(timeout=3600, key_prefix=get_cache_key)
def get_weather():

    pincode = request.args.get('pincode')
    todays_date = datetime.today().strftime('%Y-%m-%d')
    endpoint = lambda pincode, date1: f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{pincode}/{date1}?key={API_KEY}"

    try:
        outbound_response = requests.get(endpoint(pincode, todays_date))
        outbound_response.raise_for_status()
    except HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        response = {'message': 'failure'}, 503
    except Exception as err:
        print(f"Other error occurred: {err}")
        response = {'message': 'failure'}, 503
    else:
        print("Success!")
        outbound_response_json = outbound_response.json()
        response = {'message': 'success', 'weather': outbound_response_json}, 200
    return response


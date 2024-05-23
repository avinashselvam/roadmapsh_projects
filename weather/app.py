from flask import Flask, request
from flask_cors import CORS
import requests
from requests import HTTPError
from datetime import datetime

app = Flask(__name__)
CORS(app)

API_KEY = "F4RZ8KWXHMFARTPNDRBR8M97Z"

@app.get("/weather")
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


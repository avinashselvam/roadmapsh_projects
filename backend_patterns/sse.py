from flask import Flask
from flask import request, Response
from config import create_flask_app
from celery.result import AsyncResult
from tasks import app, long_running_task
from flask_cors import CORS

CORS(app)


@app.get("/stream")
def get_stream():
    """
    creates task, delegates it and returns a task id
    """

    def event_stream():
        i = 0
        while i < 100:
            yield f"data: {i}\n\n"
            i += 1

    return Response(event_stream(), mimetype="text/event-stream")
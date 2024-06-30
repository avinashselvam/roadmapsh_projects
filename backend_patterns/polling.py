from flask import Flask
from flask import request
from config import create_flask_app
from celery.result import AsyncResult
from tasks import app, long_running_task
from flask_cors import CORS

CORS(app)

def make_response(success, message, data = None):
    return {
        "success": success,
        "message": message,
        "data": data
    }

@app.post("/tasks")
def do_long_running_task():
    """
    creates task, delegates it and returns a task id
    """
    sum_till = request.args.get("sum_till", None)

    if sum_till is None:
        return make_response(False, "sum_till is a required argument"), 401

    task = long_running_task.delay(int(sum_till))
    
    return make_response(True, "task queued successfully", {"task_id": task.id}), 201

@app.get("/status")
def get_status():
    task_id = request.args.get("task_id", None)

    if task_id is None:
        return make_response(False, "task_id is a required argument"), 401
    
    result = AsyncResult(task_id)

    print(result, result.ready(), result.successful())

    if result.ready():
        if result.successful():
            return make_response(True, "task finished successfully", result.result), 200
        else:
            return make_response(False, "task failed"), 500
    else:
        return make_response(True, "in progress", result.state), 200
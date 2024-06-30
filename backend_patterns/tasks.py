from celery import shared_task
from config import create_flask_app
from time import sleep

app = create_flask_app()
celery_app = app.extensions["celery"]

@shared_task
def long_running_task(sum_till):
    total = 0
    for i in range(sum_till):
        total += i
        sleep(2)
    return total
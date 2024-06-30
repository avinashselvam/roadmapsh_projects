from celery import Celery, Task
from flask import Flask

def celery_init_app(app):

    class FlaskTask(Task):

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
            
    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app

def create_flask_app():

    app = Flask(__name__)
    app.config.from_mapping(CELERY = {
        "broker_url": "redis://localhost:6379",
        "result_backend": "redis://localhost:6379",
        "task_ignore_result": False,
    })
    app.config.from_prefixed_env()
    celery_init_app(app)
    return app
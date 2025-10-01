import os

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
from tornado.web import StaticFileHandler


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]

    template_url = url_path_join(base_url, "launcher_tiles", "templates")
    template_dir = os.getenv(
        "JLAB_SERVER_TEMPLATE_DIR",
        os.path.join(os.path.dirname(__file__), "templates"),
    )
    handlers = [("{}/(.*)".format(template_url), StaticFileHandler, {"path": template_dir})]
    web_app.add_handlers(host_pattern, handlers)

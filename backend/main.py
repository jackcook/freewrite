import os
from flask import Flask, send_from_directory
from flask_cors import CORS

from api import mod_api

app = Flask(__name__, static_folder="build/")
app.register_blueprint(mod_api)

CORS(app)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(use_reloader=True, port=5000, threaded=True)

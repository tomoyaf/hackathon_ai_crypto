from flask import Flask, request
import os

app = Flask(__name__)

@app.route('/', methods=["POST"])
def preprocess():
    result = request.get_json()
    os.system("python preprocess.py ")  
    return {'result': result}

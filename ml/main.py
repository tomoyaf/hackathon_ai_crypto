from flask import Flask, request

app = Flask(__name__)

@app.route('/', methods=["POST"])
def preprocess():
    body = request.get_data()
    print(body)
    return {'result': body}

from flask import Flask, render_template, request
from source.summarizator import request as sumRequest
from source.rewriter import request as rewRequest

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sendToSummarizatorModel", methods=["POST"])
def sendToSummarizatorModel():
    inputData = request.get_json()
    return sumRequest(inputData)

@app.route("/sendToRewriterModel", methods=["POST"])
def sendToRewriterModel():
    inputData = request.get_json()
    return rewRequest(inputData)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
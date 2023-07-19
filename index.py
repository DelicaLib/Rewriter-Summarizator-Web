from flask import Flask, render_template, request
from source.summarizator import request as sumRequest

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sendToSummarizatorModel", methods=["POST"])
def sendToSummarizatorModel():
    inputData = request.get_json()
    return sumRequest(inputData)

if __name__ == "__main__":
    app.run(debug=True)
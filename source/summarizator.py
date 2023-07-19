# -*- coding: utf-8 -*-
import requests

def parseInputData(inputData):
    readyInputData = {}
    if "text" in inputData:
        readyInputData["text"] = inputData["text"]
    if "genstrategy" in inputData:
        readyInputData["genstrategy"] = inputData["genstrategy"]
    if "num_beams" in inputData:
        readyInputData["num_beams"] = int(inputData["num_beams"])
    if "num_return_sequences" in inputData:
        readyInputData["num_return_sequences"] = int(inputData["num_return_sequences"])
    if "no_repeat_ngram_size" in inputData:
        readyInputData["no_repeat_ngram_size"] = int(inputData["no_repeat_ngram_size"])
    if "repetition_penalty" in inputData:
        readyInputData["repetition_penalty"] = float(inputData["repetition_penalty"])  
    if "length_penalty" in inputData:
        readyInputData["length_penalty"] = float(inputData["length_penalty"])    
    if "top_k" in inputData:
        readyInputData["top_k"] = int(inputData["top_k"])
    if "top_p" in inputData:
        readyInputData["top_p"] = float(inputData["top_p"])
    if "temperature" in inputData:
        readyInputData["temperature"] = float(inputData["temperature"])
    return readyInputData

def request(inputData):
    inputData = parseInputData(inputData)
    response = requests.post("https://api.aicloud.sbercloud.ru/public/v2/summarizator/predict", json={
        "instances": [
            inputData
        ]
    }).json()
    if ("detail" in response):
        return {"comment": "Ошибка"}
    
    if response['comment'] == "Ok!":
        return response

    return {"comment": response['comment']}
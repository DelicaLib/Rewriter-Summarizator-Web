# -*- coding: utf-8 -*-
import requests

def parseInputData(inputData):
    readyInputData = {}
    if "text" in inputData:
        readyInputData["text"] = inputData["text"]
    if "range_mode" in inputData:
        readyInputData["range_mode"] = inputData["range_mode"]
    if "num_return_sequences" in inputData:
        readyInputData["num_return_sequences"] = int(inputData["num_return_sequences"])
    if "repetition_penalty" in inputData:
        readyInputData["repetition_penalty"] = float(inputData["repetition_penalty"])  
    if "top_k" in inputData:
        readyInputData["top_k"] = int(inputData["top_k"])
    if "top_p" in inputData:
        readyInputData["top_p"] = float(inputData["top_p"])
    if "temperature" in inputData:
        readyInputData["temperature"] = float(inputData["temperature"])
    return readyInputData

def request(inputData):
    inputData = parseInputData(inputData)
    response = requests.post("https://api.aicloud.sbercloud.ru/public/v2/rewriter/predict", json={
        "instances": [
            inputData
        ]
    }).json()
    if "detail" in response:
        return {"comment": "Ошибка"}
    
    if "comment" not in response:
        response["comment"] = "Ok!"
        return response

    return {"comment": response['comment']}
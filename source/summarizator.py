# -*- coding: utf-8 -*-
import requests


def req(s):
        response = requests.post("https://api.aicloud.sbercloud.ru/public/v2/summarizator/predict", json={
            "instances": [
               s
            ]
        })
        
        if response.json()['comment'] == "Ok!":
            return response.json()
        else:
            return response.json()['comment']



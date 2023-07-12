# -*- coding: utf-8 -*-
import requests

def req(s, num_return_sequences = 6, num_beams = 5, no_repeat_ngram_size = 3, repetition_penalty = 2.0, length_penalty = 2.0, top_k = 50, top_p = 0.9, temperature = 0.95, genstrategy = "beamsearch"):
    response = requests.post("https://api.aicloud.sbercloud.ru/public/v2/summarizator/predict", json = {
                    "instances": [
                      {
                        "text": s,
                        "num_beams": num_beams,
                        "num_return_sequences": num_return_sequences,
                        "no_repeat_ngram_size": no_repeat_ngram_size,
                        "repetition_penalty": repetition_penalty,
                        "length_penalty": length_penalty,
                        "top_k": top_k,
                        "top_p": top_p,
                        "temperature": temperature,
                        "genstrategy": genstrategy

                      }
                    ]
                })
    if(response.json()['comment'] == "Ok!"):
        print("Текст успешно изменен!\n")
        print(response.json()['prediction_best']['bertscore'])
    else:
        print(response.json()['comment'])

def main():
    l = list(iter(input, ''))
    s = str()
    for i in l:
        s += i
    req(s)
if __name__ == '__main__':
    main()

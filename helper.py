from flask import request
# get the responce from ollama 
def ollama_res(prompt):
    response = request.get_data("https://ollama-api.herokuapp.com/v1")
    return response
from flask import Flask, request, make_response

app = Flask(__name__)

@app.route('/')
def response():
	return "Hi bro"

app.run(host='0.0.0.0', port=8080)
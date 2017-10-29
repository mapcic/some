from flask import Flask

import apiMath as math
import apiStat as stat

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/math/<method>', methods=['POST'])
def math(method):
	resp = None

    return resp

@app.route('/stat', methods=['GET'])
def stat():
	resp = None
	return resp

if __name__ == '__main__':
    app.run()
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

resource_data = {
	'orb': 0,
	'scroll': 0,
	'me': 0,
	'relic': 0,
	'gem': 0,
	'wood': {'t1': 0, 't2': 0, 't3': 0, 't4': 0, 't5': 0},
	'fish': {'t1': 0, 't2': 0, 't3': 0, 't4': 0, 't5': 0},
	'plant': {'t1': 0, 't2': 0, 't3': 0, 't4': 0, 't5': 0},
	'ore': {'t1': 0, 't2': 0, 't3': 0, 't4': 0, 't5': 0}
}
simple_keys = ['orb', 'scroll', 'me', 'relic', 'gem']
deep_keys = ['wood', 'fish', 'plant', 'ore']
tiers = ['t'+str(i) for i in range(1,6)]

def _update_prices(data):
	for k in simple_keys:
		resource_data[k] = int(data.get(k, resource_data[k]))
	for k in deep_keys:
		for i in tiers:
			old_value = resource_data.get(k, {}).get(i, 0)
			new_value = data.get(k, {}).get(i, old_value)

			resource_data[k][i] = int(new_value)

	return resource_data

@app.route('/market', methods=['POST'])
def update_market_prices():
	data = request.json
	data = _update_prices(data)
	return jsonify(data)

@app.route('/market', methods=['GET'])
def get_market_prices():
	return jsonify(resource_data)

@app.route('/')
def index():
    return jsonify(resource_data)

application = app
if __name__ == '__main__':
    app.run()

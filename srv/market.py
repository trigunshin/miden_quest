from flask import Blueprint, request, jsonify

market = Blueprint('market', __name__, template_folder='templates', url_prefix='/market')

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

@market.route('/', methods=['POST'])
def update_market_prices():
	data = request.json
	data = _update_prices(data)
	return jsonify(data)

@market.route('/', methods=['GET'])
def get_market_prices():
	return jsonify(resource_data)

"""
clear;curl -H "Content-Type: application/json" -X GET http://localhost:5000/
clear;curl -H "Content-Type: application/json" -X GET http://localhost:5000/market
clear;curl -H "Content-Type: application/json" -X GET http://localhost:5000/market/
clear;curl -H "Content-Type: application/json" -d '{"orb": 1}' -X POST http://localhost:5000/market
clear;curl -H "Content-Type: application/json" -d '{"orb": 2}' -X POST http://localhost:5000/market/
"""

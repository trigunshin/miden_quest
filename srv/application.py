from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config.from_pyfile('config.py')
CORS(app)

#import/init DB
from model import db, User, UserProfileView, get_user_view_diff
db.init_app(app)
with app.test_request_context():
	db.create_all()

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

def _ensure_user(user_name):
	u = User.query.filter_by(username=user_name).first()
	if u is None:
		u = User(user_name)
		u.save()
	return u

def _record_profile(user, profile):
	actions = profile['actions']
	p = UserProfileView(user, actions)
	p.save()
	return p

@app.route('/market', methods=['POST'])
def update_market_prices():
	data = request.json
	data = _update_prices(data)
	return jsonify(data)

@app.route('/players/<username>/diffs/36', methods=['GET'])
def get_36h_diff(username):
	user = _ensure_user(username)
	diffs = get_user_view_diff(user, 36)

	recent = diffs['recent']
	oldest = diffs['oldest']
	updated_actions = recent.actions - oldest.actions

	return jsonify({'user_id': user.id, 'actions_diff': updated_actions, 'start': oldest.created_on, 'end': recent.created_on})

@app.route('/players', methods=['POST'])
def update_player_info():
	data = request.json
	user_data = data['user']
	user_name = user_data['username']
	user_profile = data['profile']

	user = _ensure_user(user_name)
	profile = _record_profile(user, user_profile)

	return jsonify({'user_name': user.username, 'actions': profile.actions, 'ts': profile.created_on})

@app.route('/market', methods=['GET'])
def get_market_prices():
	return jsonify(resource_data)

@app.route('/')
def index():
    return jsonify(resource_data)

application = app
if __name__ == '__main__':
    app.run()

from flask import Blueprint, jsonify
from jinja2 import TemplateNotFound

user = Blueprint('user', __name__, template_folder='templates', url_prefix='/players')


@user.route('/<username>/diffs/36', methods=['GET'])
def get_36h_diff(username):
	user = ensure_user(username)
	diffs = get_user_view_diff(user, 36)

	recent = diffs['recent']
	oldest = diffs['oldest']
	updated_actions = recent.actions - oldest.actions

	return jsonify({'user_id': user.id, 'actions_diff': updated_actions, 'start': oldest.created_on, 'end': recent.created_on})

@user.route('/', methods=['POST'])
def update_player_info():
	data = request.json
	user_data = data['user']
	user_name = user_data['username']
	user_profile = data['profile']

	user = ensure_user(user_name)
	profile = record_profile(user, user_profile)

	return jsonify({'user_name': user.username, 'actions': profile.actions, 'ts': profile.created_on})

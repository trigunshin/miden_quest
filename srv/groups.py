from flask import Blueprint, jsonify
from jinja2 import TemplateNotFound

from model import ensure_user, ensure_group, associate_user_group, disassociate_user_group

group = Blueprint('group', __name__, template_folder='templates', url_prefix='/group')

@group.route('/<name>', methods=['GET'])
def get_group(name):
	group = ensure_group(name)
	names = [u.username for u in group.users]
	return jsonify({'name': group.name, 'users': names})

@group.route('/<name>', methods=['POST'])
def add_group(name):
	group = ensure_group(name)
	return jsonify({'name': group.name})

@group.route('/<group_name>/players/<user_name>', methods=['POST'])
def add_group_player(group_name, user_name):
	group = ensure_group(group_name)
	user = ensure_user(user_name)
	group, user = associate_user_group(group, user)

	return jsonify({'group_name': group.name, 'player_name': user.username})

@group.route('/<group_name>/players/<user_name>', methods=['DELETE'])
def remove_group_player(group_name, user_name):
	group = ensure_group(group_name)
	user = ensure_user(user_name)
	
	group, user = disassociate_user_group(group, user)

	return jsonify({'group_name': group.name, 'player_name': user.username})

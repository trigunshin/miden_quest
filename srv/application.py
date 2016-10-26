from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from groups import group
from users import user
from market import market, get_market_prices, update_market_prices

app = Flask(__name__)
app.config.from_pyfile('config.py')
CORS(app)

#import/init DB
from model import db, User, UserProfileView, UserGroup, get_user_view_diff, ensure_user, record_profile
db.init_app(app)
with app.test_request_context():
	db.create_all()

@app.route('/market', methods=['POST'])
def update_market():
	return update_market_prices()

@app.route('/market', methods=['GET'])
def get_market():
	return get_market_prices()

@app.route('/')
def index():
	return get_market_prices()

app.register_blueprint(group)
app.register_blueprint(user)
app.register_blueprint(market)

application = app
if __name__ == '__main__':
    app.run()

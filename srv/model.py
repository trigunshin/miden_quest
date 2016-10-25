from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import asc, desc

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(250), unique=True)
    created_on = db.Column(db.DateTime)
    
    def __init__(self, username, created_on=None):
        self.username = username
        if created_on is None:
            created_on = datetime.utcnow()
        self.created_on = created_on

    def __repr__(self):
        return '<User %r>' % self.username

    def save(self):
        db.session.add(self)
        db.session.commit()

    def get_action_diff(self, hours=36):
        ts = datetime.now() - timedelta(hours=hours)

        # .order_by(desc(Notes.added_at))

        return self.query.filter_by(created_on>=ts).order_by(desc(self.created_on))

class UserProfileView(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    actions = db.Column(db.BigInteger)
    created_on = db.Column(db.DateTime)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User',
        backref=db.backref('profile_views', lazy='dynamic'))
    
    def __init__(self, user, actions, created_on=None):
        self.actions = actions
        if created_on is None:
            created_on = datetime.utcnow()
        self.created_on = created_on
        self.user = user

    def __repr__(self):
        return '<UserProfileView %r>' % self.id

    def save(self):
        db.session.add(self)
        db.session.commit()

def _get_user_views(user, hours=36):
    ts = datetime.utcnow() - timedelta(hours=hours)
    return UserProfileView.query.filter(UserProfileView.user==user, UserProfileView.created_on>=ts)
def get_recent_user_view(user, hours=36):
    return _get_user_views(user, hours).order_by(desc(UserProfileView.created_on)).first()
def get_oldest_user_view(user, hours=36):
    return _get_user_views(user, hours).order_by(asc(UserProfileView.created_on)).first()
def get_user_view_diff(user, hours):
    ret = {}
    ret['recent'] = get_recent_user_view(user, hours)
    ret['oldest'] = get_oldest_user_view(user, hours)
    return ret


"""
clear;curl -H "Content-Type: application/json" -X POST -d '{"user":{"username":"derivagral"}, "profile":{"actions":6000}}' http://localhost:5000/players
clear;curl -H "Content-Type: application/json" -X POST -d '{"user":{"username":"derivagral"}}' http://localhost:5000/players/diffs/36
#"""

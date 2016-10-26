from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import asc, desc

db = SQLAlchemy()

groups_users = db.Table(
    'user_group_user_map',
    db.Column('user_id', db.Integer,
              db.ForeignKey('user.id')),
    db.Column('group_id', db.Integer, db.ForeignKey('user_group.id'))
)

class UserGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), unique=True)
    created_on = db.Column(db.DateTime)
    users = db.relationship('User', secondary=groups_users, backref='groups')
    
    def __init__(self, name, created_on=None):
        self.name = name
        if created_on is None:
            created_on = datetime.utcnow()
        self.created_on = created_on

    def __repr__(self):
        return '<UserGroup %r>' % self.name

    def save(self):
        db.session.add(self)
        db.session.commit()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(250), unique=True)
    created_on = db.Column(db.DateTime)
    
    def __init__(self, username, created_on=None):
        self.username = username.lower()
        if created_on is None:
            created_on = datetime.utcnow()
        self.created_on = created_on

    def __repr__(self):
        return '<User %r>' % self.username

    def save(self):
        db.session.add(self)
        db.session.commit()

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

def ensure_user(user_name):
    u = User.query.filter_by(username=user_name).first()
    if u is None:
        u = User(user_name)
        u.save()
    return u

def ensure_group(name):
    u = UserGroup.query.filter_by(name=name).first()
    if u is None:
        u = UserGroup(name)
        u.save()
    return u

def record_profile(user, profile):
    actions = profile['actions']
    p = UserProfileView(user, actions)
    p.save()
    return p

def associate_user_group(group, user):
    group.users.append(user)
    db.session.add(group)
    db.session.commit()
    return group, user

def disassociate_user_group(group, user):
    group.users.remove(user)
    db.session.add(group)
    db.session.commit()
    return group, user

"""
clear;curl -H "Content-Type: application/json" -X POST -d '{"user":{"username":"derivagral"}, "profile":{"actions":6000}}' http://localhost:5000/players
clear;curl -H "Content-Type: application/json" -X POST -d '{"user":{"username":"derivagral"}}' http://localhost:5000/players/diffs/36

clear;curl -H "Content-Type: application/json" -X POST http://localhost:5000/group/Venice
clear;curl -H "Content-Type: application/json" -X POST http://localhost:5000/group/Venice/players/derivagral

clear;curl -H "Content-Type: application/json" -X POST http://localhost:5000/group/Venice/players/ikitoro
clear;curl -H "Content-Type: application/json" -X DELETE http://localhost:5000/group/Venice/players/ikitoro

clear;curl -H "Content-Type: application/json" -X GET http://localhost:5000/group/Venice
#"""

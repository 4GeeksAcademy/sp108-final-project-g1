import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, Users, Bookings, Huts, HutFavorites, HutsAlbum, Location, Review


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    # Add your models here, for example this is how we add a the User model to the admin
    # You can duplicate that line to add mew models
    admin.add_view(ModelView(Users, db.session))
    admin.add_view(ModelView(Bookings, db.session))
    admin.add_view(ModelView(Huts, db.session))
    admin.add_view(ModelView(HutsAlbum, db.session))
    admin.add_view(ModelView(Location, db.session))
    admin.add_view(ModelView(Review, db.session))
    admin.add_view(ModelView(HutFavorites, db.session))

from werkzeug.security import generate_password_hash, check_password_hash


class User(object):
    def __init__(self, username, password):
        self.username = username
        self.set_password_hash(password)

    def set_password_hash(self, password):
        self.pw_hash = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)

    def check_password(self, password):
        return check_password_hash(self.pw_hash, password)
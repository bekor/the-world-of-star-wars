from flask import Flask, session, redirect, url_for, escape, request, render_template
from flask_restful import Resource, Api
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
api = Api(app)

@app.route('/')
def index():
    print(session)
    if 'username' in session:
        return 'Logged in as %s' % escape(session['username'])
    return 'You are not logged in'

def set_password_hash(password):
    pw_hash = generate_password_hash(password)
    return pw_hash

def check_password(self, password):
        return check_password_hash(self.pw_hash, password)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['sessionId'] = os.urandom(24)
        session['username'] = request.form['username']
        session['password'] = set_password_hash(request.form['password'])
        return redirect(url_for('index'))
    return '''
        <form method="post">
            <p><input type=text name=username></p>
            <p><input type=text name=password></p>
            <p><input type=submit value=Login></p>
        </form>
    '''

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))

# set the secret key.  keep this really secret:
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

@app.route('/list')
def home():
    if 'username' in session:
        planet_properties_name = ["Name", "Diameter in KM", "Climate", "Terrain", 
                                "Surface water", "Population", "Residents"]
        return render_template('planets.html', planet_properties_name=planet_properties_name)
    else:
        return redirect(url_for('login'))


# @app.route('/board/<int:board_id>')
# def about(board_id):
#     menu_items = "Add new card"
#     return render_template('board_details.html', create_object=menu_items)

class Document(Resource):
    def get(self):
        return {'hello' : 'world'}

api.add_resource(Document, '/document')

if __name__ == '__main__':
    app.run(debug=True)
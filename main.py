from flask import Flask, session, redirect, url_for, escape, request, render_template, json
from flask_restful import Resource, Api
from hash_helper import set_password_hash, check_password
from database_manager import query_handler
import os

app = Flask(__name__)
api = Api(app)


@app.route('/')
def index():
    if 'username' in session:
        return render_template('list.html')
    return render_template('index.html')


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
    planet_properties_name = ["Name", "Diameter in KM", "Climate", "Terrain", 
                              "Surface water", "Population", "Residents"]
    if 'username' in session:
        return render_template('planets.html',
                               planet_properties_name=planet_properties_name,
                               )
    else:
        return render_template('planets.html',
                               planet_properties_name=planet_properties_name,
                               )


class Document(Resource):
    def get(self):
        return {'hello': 'world'}

api.add_resource(Document, '/document')

if __name__ == '__main__':
    app.run(debug=True)
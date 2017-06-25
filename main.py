from flask import Flask, session, request, render_template, json
from hash_helper import User
from database_manager import query_handler
from werkzeug.security import check_password_hash
import os

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/list')
def list_planets():
    planet_properties_name = ["Name", "Diameter", "Climate", "Terrain", 
                              "Surface water", "Population", "Residents"]
    return render_template('planets.html',
                           planet_properties_name=planet_properties_name,
                           )


@app.route('/login', methods=['POST'])
def login():
    pw = request.form['password']
    username = request.form['username']
    database_pw = query_handler.get_user_password(username)
    if(check_password_hash(database_pw, pw)):
        session['sessionId'] = os.urandom(24)
        session['username'] = username
        return json.dumps({'status': 'OK', 'username': username})
    else:
        return json.dumps({'status': 'NO', 'username': username})


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return json.dumps({'status': 'OK'})


@app.route('/registration', methods=['POST'])
def registration():
    pw = request.form['regPassword']
    username = request.form['regUsername']
    user_exist = query_handler.username_exist(username)
    if user_exist:
        return json.dumps({'status': 'NO', 'username': username})
    else:
        new_user = User(username, pw)
        user_data = {
            'username': username,
            'password': new_user.pw_hash
        }
        query_handler.user_registration(user_data)
        return json.dumps({'status': 'OK'})


@app.route('/planetvote', methods=['POST'])
def planetvote():
    planet_id = request.form['planetid']
    username = request.form['username']
    query_handler.insert_vote(planet_id, username)
    return json.dumps({'status': 'OK'})


@app.route('/<username>/voted-planets')
def user_voted_planets(username):
    planets = query_handler.get_user_voted_planets(username)
    return json.dumps({'status': 'OK', 'planets': planets})


@app.route('/list-of-voted-planets')
def voted_planets():
    statistics = []
    planet_votes = query_handler.get_voted_planets()
    for planet in planet_votes:
        current_planet = {"planetUrl": "http://swapi.co/api/planets/" + str(planet[0]) + '/',
                          "votes": str(planet[1])}
        statistics.append(current_planet)
    return json.dumps({'status': 'OK', 'statistics': statistics})


# set the secret key.  keep this really secret:
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


if __name__ == '__main__':
    app.run(debug=True)

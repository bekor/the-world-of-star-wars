from flask import Flask, session, redirect, url_for, escape, request, render_template, json, jsonify
from flask_restful import Resource, Api, reqparse
from hash_helper import User
from database_manager import query_hand
from werkzeug.security import check_password_hash
import os

app = Flask(__name__)
api = Api(app)


@app.route('/')
def index():
    if 'username' in session:
        return redirect(url_for('list_planets'))
    return render_template('index.html')


@app.route('/list')
def list_planets():
    planet_properties_name = ["Name", "Diameter in KM", "Climate", "Terrain", 
                              "Surface water", "Population", "Residents"]
    return render_template('planets.html',
                           planet_properties_name=planet_properties_name,
                           )


@app.route('/login', methods=['POST'])
def login():
    pw = request.form['password']
    username = request.form['username']
    database_pw = query_hand.get_user_password(username)
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
    user_exist = query_hand.username_exist(username)
    if user_exist:
        return json.dumps({'status': 'NO', 'username': username})
    else:
        new_user = User(username, pw)
        user_data = {
            'username': username,
            'password': new_user.pw_hash
        }
        query_hand.user_registration(user_data)
        return json.dumps({'status': 'OK'})


@app.route('/planetvote', methods=['POST'])
def planetvote():
    planet_id = request.form['planetid']
    username = request.form['username']
    query_hand.insert_vote(planet_id, username)
    return json.dumps({'status': 'OK'})


@app.route('/<username>/voted-planets')
def user_voted_planets(username):
    planets = query_hand.get_user_voted_planets(username)
    return json.dumps({'status': 'OK', 'planets': planets})


# set the secret key.  keep this really secret:
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


# class Registration(Resource):
    # def get(self):
    #     return {'macska':'eger'}

    # def post(self):
    #     print("Fak this shit")
    #     parser = reqparse.RequestParser()
    #     print(dir(parser))
    #     print(id(parser))
    #     print(callable(parser))
    #     parser.add_argument('username', type=str, required=True)
    #     parser.add_argument('password', type=str, required=True)

    #     args = parser.parse_args()
    #     print('name ' + args['username'])
    #     print(parser.args)
    #     # pw = set_password_hash()
    #     # user_data = {
    #     #     username: user_reg_data.username,
    #     #     passord: pw
    #     # }
    #     # user_registration(user_data)
    #     return {'hello': 'user'}
# api.add_resource(Registration, '/registration')

if __name__ == '__main__':
    app.run(debug=True)
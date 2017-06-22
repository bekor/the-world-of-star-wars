# from database_manager.server_connection.database_connection import Database
from database_manager.server_connection.connect import connect_to_sql
from datetime import datetime


@connect_to_sql
def user_registration(cursor, user_data):
    query = """INSERT INTO swuser(username, password)
            VALUES (%s, %s);
            """
    cursor.execute(query, (user_data['username'], user_data['password']))


@connect_to_sql
def get_user_password(cursor, username):
    query = """SELECT password FROM swuser WHERE username = %s"""
    cursor.execute(query, (username,))
    query_fatch = cursor.fetchall()
    return query_fatch[0][0]


@connect_to_sql
def username_exist(cursor, username):
    query = """SELECT username FROM swuser"""
    cursor.execute(query)
    query_fatch = cursor.fetchall()
    print(query_fatch)
    if username in query_fatch:
        return True
    else:
        return False


@connect_to_sql
def insert_vote(cursor, planet_id, username):
    local_time = datetime.now()
    swuser_id = get_user_id(username)
    query = """INSERT INTO planet_votes(planet_id, swuser_id, submission_time)
            VALUES (%s, %s, %s);
            """
    cursor.execute(query, (planet_id, swuser_id, local_time[:-7]))


@connect_to_sql
def get_user_id(cursor, username):
    query = """SELECT id FROM swuser WHERE username = %s"""
    cursor.execute(query, (username,))
    query_fatch = cursor.fetchall()
    return query_fatch[0][0]


@connect_to_sql
def get_user_voted_planets(cursor, username):
    swuser_id = get_user_id(username)
    print(swuser_id)
    query = """SELECT planet_id FROM planet_votes WHERE swuser_id = %s"""
    cursor.execute(query, (swuser_id,))
    query_fatch = cursor.fetchall()
    planetArray = [str(pl_id) for pl_id in query_fatch[0]]
    print(planetArray)
    return planetArray

# def user_registration(user_data):
#     db = Database()
#     query = """INSERT INTO swuser(username, password)
#             VALUES ({}, {});""".format(user_data['username'], str(user_data['password']))
#     db.query_handler(query)
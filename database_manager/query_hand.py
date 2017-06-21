# from database_manager.server_connection.database_connection import Database
from database_manager.server_connection.connect import connect_to_sql


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

    
# def user_registration(user_data):
#     db = Database()
#     query = """INSERT INTO swuser(username, password)
#             VALUES ({}, {});""".format(user_data['username'], str(user_data['password']))
#     db.query_handler(query)
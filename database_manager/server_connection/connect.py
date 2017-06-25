import psycopg2
import sys
import urllib
import os
# from .config import get_config


def connect_to_sql(func):
    def with_connection(*args):
        connection = None
        sql_query_func = None
        urllib.parse.uses_netloc.append('postgres')
        url = urllib.parse.urlparse(os.environ.get('DATABASE_URL'))
        try:
            connection = psycopg2.connect(
                database=url.path[1:],
                user=url.username,
                password=url.password,
                host=url.hostname,
                port=url.port
            )

            # for local developement:
            # connect_str = get_config()
            # connection = psycopg2.connect(host=connect_str["host"],
            #                               user=connect_str["user"],
            #                               password=connect_str["passwd"],
            #                               dbname=connect_str["dbname"])
            connection.autocommit = True
            cursor = connection.cursor()

            sql_query_func = func(cursor, *args)

            cursor.close()

        except psycopg2.IntegrityError as db_exception:
            print("From IntegrityError: %s" % db_exception)
            print(db_exception.with_traceback(sys.exc_info()[2]))

        except psycopg2.DatabaseError as db_exception:
            print("From DatabaseError: %s" % db_exception)
            print(db_exception.with_traceback(sys.exc_info()[2]))

        except psycopg2.InterfaceError as db_exception:
            print("From InterfaceError, something with the database interface: %s" % db_exception)
            print(db_exception.with_traceback(sys.exc_info()[2]))

        finally:
            if connection:
                connection.close()

        return sql_query_func
    return with_connection
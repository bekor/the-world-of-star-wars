import psycopg2
from . import config
# from . import config_temp


class Database():
    # rename config_temp to config
    # settings = config.get_config()

    def __init__(self):
        self.settings = config.get_config()

        try:
            # use config_temp connection values to establish a connection
            self.connection = psycopg2.connect(host=self.settings["host"],
                                               dbname=self.settings["dbname"],
                                               user=self.settings["user"],
                                               password=self.settings["passwd"])

            self.cursor = self.connection.cursor()
        except psycopg2.DatabaseError as exception:
            print("There were some connection issue \n %s" % exception)

    def __enter__(self):
        return self

    def query_handler(self, query):
        cursor = self.cursor
        cursor.execute(query)
        return cursor.fetchall()

    def __exit__(self, exc_type, exc_values, traceback):
        self.cursor.close()
        if self.connection:
            self.connection.close()


if __name__ == '__main__':
    db = Database()
    q = "SELECT * FROM planet_votes"
    print(db.query_handler(q))
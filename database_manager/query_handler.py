from database_manager.server_connection.database_connection import Database


def sql_mentors_schools():
    with Database() as db:
        query = """SELECT mentors.first_name, mentors.last_name, schools.name, schools.country
                FROM mentors
                LEFT OUTER JOIN schools
                ON mentors.city = schools.city
                ORDER BY mentors.id
                """
        return db.query_handler(query)


def sql_all_school():
    with Database() as db:
        query = """SELECT mentors.first_name, mentors.last_name, schools.name, schools.country
                FROM mentors
                RIGHT OUTER JOIN schools
                ON mentors.city = schools.city
                ORDER BY mentors.id
                """
        return db.query_handler(query)


def sql_mentors_by_country():
    with Database() as db:
        query = """SELECT schools.country, COUNT(mentors.id)
                FROM mentors
                INNER JOIN schools
                ON mentors.city = schools.city
                GROUP BY schools.country
                """
        return db.query_handler(query)


def sql_contacts():
    with Database() as db:
        query = """SELECT schools.name, mentors.first_name, mentors.last_name
                FROM mentors
                INNER JOIN schools
                ON mentors.city = schools.city
                ORDER BY schools.name
                """
        return db.query_handler(query)


def sql_applicants_dates():
    with Database() as db:
        query = """SELECT applicants.first_name, applicants.application_code, applicants_mentors.creation_date
                FROM applicants
                INNER JOIN applicants_mentors
                ON applicants.id = applicants_mentors.applicant_id
                WHERE applicants_mentors.creation_date> '2016-01-01'
                ORDER BY applicants_mentors.creation_date DESC
                """
        return db.query_handler(query)


def sql_applicants_and_mentors():
    with Database() as db:
        query = """SELECT applicants.first_name, applicants.application_code, mentors.first_name, mentors.last_name
                FROM applicants_mentors
                LEFT OUTER JOIN mentors
                ON mentors.id = applicants_mentors.mentor_id
                RIGHT OUTER JOIN applicants
                ON applicants.id = applicants_mentors.applicant_id
                ORDER BY applicants.id
                """
        return db.query_handler(query)


def test():
    with Database() as db:
        q = "SELECT * FROM mentors"
        return db.query_handler(q)

if __name__ == '__main__':
    test()
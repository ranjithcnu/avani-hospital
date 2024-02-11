from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import secrets
from datetime import date
from datetime import datetime


app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['SESSION_COOKIE_NAME'] = 'test'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SECURE'] = False

print(app.config['SECRET_KEY'])

@app.before_request
def log_request():
    print(f"Incoming request: {request.method} {request.path}")

# Database configuration


config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'avani',
    'raise_on_warnings': True
}

def get_db_connection():
    conn = mysql.connector.connect(**config)
    if conn:
        print("ssss")
    else :
        print("ffff")
    return conn



@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        conn = get_db_connection()

        cursor = conn.cursor()

        # Assuming the emp_details table has the fields for login, you'd likely have a separate user table.
        query = "SELECT * FROM emp_login WHERE user=%s AND pass=%s"
        cursor.execute(query, (data['user'], data['pass']))

        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if result:
            return jsonify({"success": True, "message": "Logged in!"})
        else:
            return jsonify({"success": False, "message": "Invalid credentials."})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})


@app.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    today = date.today().strftime('%Y-%m-%d')

    conn = get_db_connection()
    cursor = conn.cursor()

    # Count of employees who are present on the given date
    query_present_with_date = "SELECT COUNT(*) FROM emp_att WHERE date = %s AND att_status = 'Present'"
    cursor.execute(query_present_with_date, (today,))
    result = cursor.fetchone()
    present_count = result[0] if result else 0
    print("present count for date", today, ":", present_count)
    
    # Total employees from emp_details table
    query_total_emp_details = "SELECT COUNT(*) FROM emp_details"
    cursor.execute(query_total_emp_details)
    total_emp_details = cursor.fetchone()[0]
    
    absent_count = total_emp_details - present_count

    cursor.close()
    conn.close()

    # Return the data as a JSON response
    return jsonify({
        "date": today,
        "present": present_count,
        "absent": absent_count,
        "total": total_emp_details
    })



@app.route('/addpatient', methods=['POST'])
def add_patient():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if the patientname and mobile already exist in the table
    check_query = "SELECT * FROM patientdetails WHERE patientname = %s AND mobile = %s"
    cursor.execute(check_query, (data['patientname'], data['mobile']))
    existing_patient = cursor.fetchone()
    
    if existing_patient:
        cursor.close()
        conn.close()
        return jsonify({"success": False, "message": "Patient with the same name and mobile already exists!"})
    
    # Insert data into the table if the patient doesn't exist
    insert_query = "INSERT INTO patientdetails (patientname, mobile,visitedfrom, age,blood_pressure, dateofvisit, gender) VALUES (%s, %s, %s, %s, %s, %s,%s)"
    cursor.execute(insert_query, (data['patientname'], data['mobile'],data['visitedfrom'], data['age'],data['blood_pressure'], data['dateofvisit'], data['gender']))
    print("patient added!")
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"success": True, "message": "Patient Added!"})

@app.route('/getserialnumber', methods=['GET'])
def get_serial_number():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get the current date in dd-mm-yyyy format
    current_date = datetime.now().strftime('%d-%m-%Y')
    print("date",current_date)

    # Query to count rows with the same date in the patientdetails table
    query = "SELECT COUNT(*) FROM patientdetails WHERE dateofvisit = %s"
    
    
    cursor.execute(query, (current_date,))
    result = cursor.fetchone()
    if result:
        print("count",result)
        # Extract the count
        count = result[0]
        
        # Close the database connection
        conn.close()
        # Return the count as JSON response
        return jsonify({"serialNumber": count})




@app.route('/mark_attendance', methods=['POST'])
def mark_attendance():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if a record for the given emp_name and date already exists
    check_query = "SELECT * FROM emp_att WHERE emp_name = %s AND date = %s"
    cursor.execute(check_query, (data['emp_name'], data['date']))
    existing_record = cursor.fetchone()

    if existing_record:
        # Close database connections before returning
        cursor.close()
        conn.close()
        return jsonify({"success": False, "message": "Attendance has already been marked for this day!"})

    query = "INSERT INTO emp_att (emp_name, date, att_status) VALUES (%s, %s, %s)"
    cursor.execute(query, (data['emp_name'], data['date'], data['att_status']))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"success": True, "message": "Attendance marked!"})


@app.route('/employees', methods=['GET'])
def get_employees():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM emp_details")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/lend_details', methods=['POST'])
def lend_details():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "INSERT INTO lend_details (emp_name, amount, reason, date_took) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (data['emp_name'], data['amount'], data['reason'], data['date_took']))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"success": True, "message": "Lending details uploaded!"})

@app.route('/get_lend_details', methods=['GET'])
def get_lend_details():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Your SQL queries to fetch data from 'emp_att' or other relevant tables
    cursor.execute("SELECT * FROM lend_details")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/transaction', methods=['POST'])
def transaction():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "INSERT INTO transactions (emp_name, Amount_sent, date_paid) VALUES (%s, %s, %s)"
    cursor.execute(query, (data['emp_name'], data['Amount_sent'], data['date_paid']))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"success": True, "message": "Transaction recorded!"})

def fetch_total_lent():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(amount) as total_amount FROM lend_details")
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result[0] if result else 0

@app.route('/money_lending_details', methods=['GET'])
def get_money_lending_details():
    total_lent = fetch_total_lent()
    if total_lent is not None:
        return jsonify({"total_amount": total_lent})
    else:
        return jsonify({"error": "Failed to fetch money lending details."})

    

@app.route('/total_amount', methods=['GET'])
def get_total_amount():
      
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get the current month and year
    today = date.today()
    current_month = today.month
    current_year = today.year

    # Define the query to get the employee details
    query = """
    SELECT 
    e.emp_name,
    COUNT(DISTINCT a.id) AS days_present,  -- Count each unique attendance day
    (COUNT(DISTINCT a.id) * e.day_wage) AS amount_to_be_paid
FROM 
    emp_details e
LEFT JOIN 
    emp_att a ON e.emp_name = a.emp_name AND MONTH(a.date) = %s AND YEAR(a.date) = %s
GROUP BY 
    e.emp_name;
    """
    cursor.execute(query, (current_month, current_year))
    records = cursor.fetchall()

    total_amount = sum(record[2] for record in records)
    
    total_lent = fetch_total_lent()
    finalpay = int(total_amount) - int(total_lent)

    cursor.close()
    conn.close()

    return jsonify({
        "total_amount": total_amount,
        "final_pay": finalpay
    })


@app.route('/att_details', methods=['POST'])
def get_attendance_details():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        SELECT * FROM emp_att
        WHERE  date BETWEEN %s AND %s
    """
    
    cursor.execute(query, (data['startDate'], data['endDate']))
    records = cursor.fetchall()

    results = []
    for record in records:
        date_string = record[2]
        date_object = datetime.strptime(date_string, '%Y-%m-%d')  # assuming it's formatted as 'YYYY-MM-DD'
        formatted_date = date_object.strftime('%Y-%m-%d')
        
        results.append({
            "id": record[0],
            "emp_name": record[1],
            "date": formatted_date,
            "att_status": record[3]
        })

    cursor.close()
    conn.close()

    return jsonify(results)


@app.route('/update_attendance', methods=['POST'])
def update_attendance():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "UPDATE emp_att SET att_status = %s WHERE id = %s"
    cursor.execute(query, (data['att_status'], data['id']))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"success": True, "message": "Attendance updated!"})


@app.route('/update_lend_details', methods=['POST'])
def update_lend_details():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    # SQL query to update the lend_details table
    query = """
        UPDATE lend_details 
        SET status = %s, date_completed = %s
        WHERE id = %s
    """
    try:
        cursor.execute(query, (data['status'], data['date_completed'], data['id']))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"success": True, "message": "Lending details updated successfully!"})
    
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({"success": False, "message": f"Failed to update lending details. Error: {str(e)}"})
    
@app.route('/employee_Salary_details', methods=['GET'])
def get_employee_salary_details():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get the current month and year
    today = date.today()
    current_month = today.month
    current_year = today.year

    # Define the query to get the employee details
    query = """
    SELECT 
        e.emp_name,
        COUNT(DISTINCT a.id) AS days_present,
        (COUNT(DISTINCT a.id) * e.day_wage) AS amount_to_be_paid,
        COALESCE(ld.times_borrowed, 0) AS times_borrowed,
        COALESCE(ld.total_lent, 0) AS total_lent,
        COALESCE(lt.total_taken_amount, 0) AS total_taken_amount, 
        ((COUNT(DISTINCT a.id) * e.day_wage) - COALESCE(lt.total_taken_amount, 0)) AS final_salary_to_be_paid
    FROM 
        emp_details e
    LEFT JOIN 
        emp_att a ON e.emp_name = a.emp_name AND MONTH(a.date) = %s AND YEAR(a.date) = %s
    LEFT JOIN (
        SELECT 
            emp_name,
            COUNT(id) AS times_borrowed,
            SUM(CASE 
                WHEN amount <> 0 AND (status IS NULL OR status = '') THEN amount
                ELSE 0 
                END) AS total_lent
        FROM 
            lend_details
        WHERE 
            MONTH(date_took) = %s AND YEAR(date_took) = %s
        GROUP BY 
            emp_name
    ) AS ld ON e.emp_name = ld.emp_name
    LEFT JOIN (
        SELECT 
            emp_name,
            SUM(amount) AS total_taken_amount
        FROM
            lend_details
        WHERE 
            date_took BETWEEN DATE_SUB(CURDATE(), INTERVAL DAY(CURDATE())-1 DAY) AND CURDATE()
        GROUP BY 
            emp_name
    ) AS lt ON e.emp_name = lt.emp_name
    GROUP BY 
        e.emp_name;
    """

    cursor.execute(query, (current_month, current_year, current_month, current_year))
    records = cursor.fetchall()

    results = []
    for record in records:
        results.append({
            "emp_name": record[0],
            "days_present": record[1],
            "amount_to_be_paid": record[2],
            "times_borrowed": record[3],
            "total_lent": record[4],
            "total_taken_amount": record[5],
            "final_salary_to_be_paid": record[6]
        })

    cursor.close()
    conn.close()

    return jsonify(results)





if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)

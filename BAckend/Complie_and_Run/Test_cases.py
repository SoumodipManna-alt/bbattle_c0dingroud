from Complie_and_Run import complie_and_run
import pyodbc
from flask import jsonify, session
from Complie_and_Run import complie_and_run

def store_all_performance(data):
    server='LAPTOP-USGC4371\SQLEXPRESS'
    database='coding_battle'
    trusted_connection='yes'
    connection_string=f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection={trusted_connection}'
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    
    
    quary='''insert into all_performance(user_email ,room_id ,testcases ,execution_time ,memoryuse ,time ,game_round ,question_id) values(?,?,?,?,?,?,?,?)'''
    cursor.execute(quary,(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7]))
    conn.commit()
    cursor.close()
    conn.close()
    return True

def performance_check(room_id,round):
    server='LAPTOP-USGC4371\SQLEXPRESS'
    database='coding_battle'
    trusted_connection='yes'
    connection_string=f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection={trusted_connection}'
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    quary='''SELECT * FROM all_performance WHERE room_id=? and game_round=?'''
    cursor.execute(quary,(room_id,round))
    result=cursor.fetchall()
    if result:
        data =[list(row) for row in result]
        sorted_data=sorted(data, key=lambda x : (-int(x[3]), float(x[4]), int(x[6])))
        
        temp_arr=[]
        for i,row in enumerate(sorted_data,start=1):
            temp_arr.append((row[1], row[2], int(row[3]), float(row[4]), int(row[5]), int(row[6]), i,int(row[7]),int(row[8])))
        # print(temp_arr)
        insert_quary='''INSERT INTO result (user_email, room_id, testcases, execution_time, memoryuse, time, position,game_round ,question_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?,?,?) '''
        cursor.executemany(insert_quary, temp_arr)# execute many enter many data
        conn.commit()
    cursor.close()
    conn.close()
    
def check_testcases(testcases, code, username, room_id, time,game_round,question_ids):
    count = 0
    total_execution_time = 0
    total_memory_usage = 0
    if(len(code)==0):
        return
    for key, value in testcases.items():
        
        result = complie_and_run.run_code(code, key)
        
        
        if result["success"]:
            total_execution_time += result["execution_time"]  
            total_memory_usage += result["memory_usage_kb"] 
            
           
            if result["output"] == value:
                count += 1
        else:
            print(f"Test case {key} failed: {result['error']}")  
    
    
    result = store_all_performance([
        username,
        room_id,
        count,
        round(total_execution_time, 2),  
        total_memory_usage,              # memory  in KB
        time,
        game_round,
        question_ids
    ])
    
    if result:
        return True
    else:
        return False

# performance_check('4r6jb')    
# result = store_all_performance([
#         'l@m',
#         'fgui',
#         3,
#         round(0.25874, 2),  # Total execution time
#         0,              # Total memory usage in KB
#         15,
#         2,
#         1

#     ]) 
# print(result)     
# performance_check('fgui',2)
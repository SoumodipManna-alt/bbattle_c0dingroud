import pyodbc


def user_details(email):
    server='LAPTOP-USGC4371\SQLEXPRESS'
    database='coding_battle'
    trusted_connection='yes'
    connection_string=f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection={trusted_connection}'
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    qury='''
    SELECT * FROM user_information WHERE  user_email=?'''
    cursor.execute(qury,email)
    result=cursor.fetchone()
    data={
        "ID":result[0],
        "Name":result[1],
        "Email":result[2],
        
    }
    qury2='''SELECT TOP 5  room_id,position FROM result WHERE user_email =?  and game_round=? ORDER BY id DESC'''
    cursor.execute(qury2,(result[2],1))
    result2=cursor.fetchall()
    result2=[list(num) for num in result2]
    cursor.close()
    conn.close()
    return data,result2
# result,d=user_details('s@m')
# print(result,d)
import pyodbc


def result_fetch(roomid,round):
    server='LAPTOP-USGC4371\SQLEXPRESS'
    database='coding_battle'
    trusted_connection='yes'
    connection_string=f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection={trusted_connection}'
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    status=0
    quary='''SELECT * FROM result WHERE room_id=? and game_round=?'''
    cursor.execute(quary,(roomid,round))
    result=cursor.fetchall()
    data=[list(row) for row in result]
    if not data:
        quary1='''SELECT * FROM all_performance WHERE room_id=? and game_round=? '''  
        cursor.execute(quary1,(roomid,round))
        result=cursor.fetchall()
        data=[list(row) for row in result]
        status=1
    cursor.close()
    conn.close()  
    return data,status

# print(result_fetch('fgui',1))
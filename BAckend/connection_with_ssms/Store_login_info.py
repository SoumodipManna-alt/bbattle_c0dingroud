import pyodbc
from flask import jsonify, session


def connection_with_db(action,data):
    server='LAPTOP-USGC4371\SQLEXPRESS'
    database='coding_battle'
    trusted_connection='yes'
    connection_string=f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection={trusted_connection}'
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    
    
    
    def fetch_data(data):
        email=data.get("email","not found")
        password=data.get("password","not found")
        
        select_quary='''
         
          SELECT * FROM user_information WHERE user_email=? AND user_password=?
          
        '''
        cursor.execute(select_quary,(email,password))
        result=cursor.fetchone()
        # print("the result",result)
        
        if result:
            session['user_id']=result[0]
            # print(session)
            return {"message":True,"user_info":list(result)}
        else:
            return {"message":False}
    
    
    def store_user_information(data):
        name=data.get("name","not found")
        email=data.get("email","not found")
        password=data.get("password","not found")
        # print("db:",data)
        if(fetch_data(data=data)["message"]): ## for checking any existing user sing up agin or not
            return False
        else:
            insert_query='''
            
            INSERT INTO user_information(user_name,user_email,user_password) VALUES(?,?,?)
            
            '''
            cursor.execute(insert_query,(name,email,password))
            conn.commit()
            return True
    
    
    
    if(action=='sign_up'):
        responce=store_user_information(data)
        cursor.close()
        conn.close()
        return responce
    elif(action=='login'):
        responce=fetch_data(data)
        cursor.close()
        conn.close()
        return responce
    else:
        return False
    

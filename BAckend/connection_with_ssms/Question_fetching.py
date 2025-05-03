import pyodbc
from flask import jsonify, session


def question_fetch(q_id):
    server='LAPTOP-USGC4371\SQLEXPRESS'
    database='coding_battle'
    trusted_connection='yes'
    connection_string=f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection={trusted_connection}'
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    
    
    select_quary='''
    
    SELECT * FROM Question WHERE q_id=?
    
    '''
    
    cursor.execute(select_quary,(q_id))
    result=cursor.fetchone()
    # if result:
    #     data={"question":result[1],"testcases":{
    #         "testcase1":{"input1":result[2],"output1":result[3]},
    #         "testcase2":{"input2":result[4],"output2":result[5]},
    #         "testcase3":{"input3":result[6],"output3":result[7]},
    #         },
    #     "question_time":result[8]*20
    #     }
    if result:
        data={"question":result[1],"testcases":{
            "testcase1":{result[2]:result[3]},#input:output
            "testcase2":{result[4]:result[5]},
            "testcase3":{result[6]:result[7]},
            },
        "question_time":result[8]
        }
        input_output_pairs = {}

        for  value in data["testcases"].values():
            input_data=list(value.keys())[0] 
            output_data=list(value.values())[0]
            input_output_pairs[input_data]=output_data
            # print("the question",data["question"])
        cursor.close()
        conn.close()  
        return data,input_output_pairs
    
# result,input_output_pairs=question_fetch(1)  
# print(input_output_pairs)

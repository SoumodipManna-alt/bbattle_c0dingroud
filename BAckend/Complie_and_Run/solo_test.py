from Complie_and_Run import complie_and_run

def submit_solo(testcases,code):
    execution_time=0
    test_result={}
    i=0
    for key,value in testcases.items():
        
        result=complie_and_run.run_code(code,key)
        if result["success"]:
            execution_time+=result["execution_time"]
            if result["output"]==value:
                test_result[i]=True
            else:
                test_result[i]=False
            i+=1
        else:
            return result  
    return test_result
            
        
        
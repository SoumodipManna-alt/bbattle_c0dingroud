# import subprocess
# import tempfile
# import py_compile
# import time,os

# def compilation_code(code):
#     # print(code)
#     with tempfile.NamedTemporaryFile(delete=False,suffix=".py") as temp:
#         temp.write(code.encode())
#         temp_fil_path=temp.name
#         temp.close()
#         # now compilation and check error (syntex)
#         try:
#             staring_time=time.time()
#             compilation_process=subprocess.run(
#                 ["python","-m","py_compile",temp_fil_path],
#                 capture_output=True,text=True
#             )
#             end_time=time.time()
#             compilation_time=end_time-staring_time

#             if compilation_process.returncode==0:
#                 result={
#                     "success":True,
#                     "message":"Compilation Successful",
#                     "compilation_time":round(compilation_time,4),
#                     "file_path":temp_fil_path
#                 }
#                 # print(result)
#             else:
#                 result={
#                     "success":False,
#                     "message":compilation_process.stderr.strip(),
#                     "compilation_time":round(compilation_time,4)
                    
#                 }
#                 # print(result)
#                 try:
#                     os.remove(temp_fil_path)  # Cleanup after execution
#                 except PermissionError:
#                     time.sleep(0.5)
#                     os.remove(temp_fil_path)

#         except Exception as e:
#             os.remove(temp_fil_path)  # Cleanup in case of exception
#             return {"success": False, "message": str(e)}
#     return result

# def run_code(code,input):
#     code_compilation=compilation_code(code)
#     if not code_compilation["success"]:
#         return {
#             "success":False,
#             "error":code_compilation["message"],
#             "compilation_time":code_compilation["compilation_time"],
#             "output":""
#         }
        
#     file_path=code_compilation["file_path"]
#     try:
#         process = subprocess.Popen(
#             ["python", file_path],
#             stdin=subprocess.PIPE,
#             stdout=subprocess.PIPE,
#             stderr=subprocess.PIPE,
#             text=True
#         )
#         output, error = process.communicate(input=input, timeout=5)
#         result = {
#             "success": process.returncode == 0,
#             "output": output.strip(),
#             "error": error.strip()
#         }
#     except subprocess.TimeoutExpired:
#         result = {
#             "success": False,
#             "output": "",
#             "error": "Execution timed out!"
#         }
        
#     finally:
#         try:
#             os.remove(file_path)  # Cleanup after execution
#         except PermissionError:
#             time.sleep(0.5)
#             os.remove(file_path)

#     return result
# import subprocess
# import tempfile
# import time
# import os
# import psutil

# def compilation_code(code):
#     # Create a temporary .py file
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as temp:
#         temp.write(code.encode())
#         temp_file_path = temp.name
#         temp.close()
        
#         # Compilation check
#         try:
#             start_time = time.time()
#             compilation_process = subprocess.run(
#                 ["python", "-m", "py_compile", temp_file_path],
#                 capture_output=True, text=True
#             )
#             end_time = time.time()
#             compilation_time = end_time - start_time

#             if compilation_process.returncode == 0:
#                 result = {
#                     "success": True,
#                     "message": "Compilation Successful",
#                     "compilation_time": round(compilation_time, 4),
#                     "file_path": temp_file_path
#                 }
#             else:
#                 result = {
#                     "success": False,
#                     "message": compilation_process.stderr.strip(),
#                     "compilation_time": round(compilation_time, 4)
#                 }
#                 # Clean up after failure
#                 os.remove(temp_file_path)

#         except Exception as e:
#             os.remove(temp_file_path)
#             return {"success": False, "message": str(e)}
        
#     return result

# def run_code(code, input_data):
#     # First, compile the code
#     code_compilation = compilation_code(code)
#     if not code_compilation["success"]:
#         return {
#             "success": False,
#             "error": code_compilation["message"],
#             "compilation_time": code_compilation["compilation_time"],
#             "output": "",
#             "execution_time": 0,
#             "memory_usage_kb": 0
#         }
    
#     file_path = code_compilation["file_path"]
#     try:
#         # Track execution time and memory usage
#         process = subprocess.Popen(
#             ["python", file_path],
#             stdin=subprocess.PIPE,
#             stdout=subprocess.PIPE,
#             stderr=subprocess.PIPE,
#             text=True
#         )
#         start_time = time.time()
#         process_pid = process.pid

#         # Safely get process memory info
#         try:
#             p = psutil.Process(process_pid)
#             mem_before = p.memory_info().rss  # Memory before execution
#         except psutil.NoSuchProcess:
#             mem_before = 0

#         # Run the code with timeout
#         try:
#             output, error = process.communicate(input=input_data, timeout=5)
#         except subprocess.TimeoutExpired:
#             process.kill()
#             output, error = "", "Execution timed out!"
#             execution_time = 5.0
#             memory_usage_kb = 0
#         else:
#             # After execution
#             end_time = time.time()
#             execution_time = end_time - start_time

#             # Safely get memory usage after execution
#             try:
#                 mem_after = p.memory_info().rss
#                 memory_usage_kb = (mem_after - mem_before) / 1024  # Memory in KB
#             except psutil.NoSuchProcess:
#                 memory_usage_kb = 0

#         # Final result
#         result = {
#             "success": process.returncode == 0,
#             "output": output.strip(),
#             "error": error.strip(),
#             "execution_time": round(execution_time, 4),
#             "memory_usage_kb": round(memory_usage_kb, 4)
#         }
        
#     except Exception as e:
#         result = {
#             "success": False,
#             "output": "",
#             "error": str(e),
#             "execution_time": 0,
#             "memory_usage_kb": 0
#         }
        
#     finally:
#         # Cleanup the temp file
#         if os.path.exists(file_path):
#             try:
#                 os.remove(file_path)
#             except PermissionError:
#                 time.sleep(1)
#                 os.remove(file_path)

#     return result

# 🔍 **Example Usage:**
# code_snippet = """
# for i in range(1000000):
#     pass
# print("Hello, World!")
# """

# input_data = ""  # No input needed for this example
# result = run_code(code_snippet, input_data)
# print(result)
import subprocess
import tempfile
import time
import os
import psutil
import py_compile

def compile_code(file_path):
    """
    Check for syntax errors using py_compile
    """
    try:
        py_compile.compile(file_path, doraise=True)
        return {"success": True, "error": ""}
    except py_compile.PyCompileError as e:
        # Extract the compilation error
        return {"success": False, "error": str(e)}

def run_code(code, input_data):
    # Create temp .py file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as temp:
        temp.write(code.encode())
        temp_file_path = temp.name
        temp.close()
    
    try:
        # Step 1: Check for Syntax Errors
        compilation_result = compile_code(temp_file_path)
        if not compilation_result["success"]:
            # Return the compilation error to the frontend
            print("compilation error",compilation_result['error'])
            return {
                "success": False,
                "output": "",
                "error": compilation_result['error'],
                "execution_time": 0,
                "memory_usage_kb": 0
            }
        
        # Step 2: Run the Compiled Code
        process = subprocess.Popen(
            ["python", temp_file_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        p = psutil.Process(process.pid)  # Track process
        start_time = time.time()
        
        # Run with timeout
        output, error = process.communicate(input=input_data, timeout=5)
        end_time = time.time()
        
        # Get memory peak usage
        try:
            mem_info = p.memory_info()
            memory_usage_kb = mem_info.rss / 1024  # Memory in KB
        except psutil.NoSuchProcess:
            memory_usage_kb = 0

        # Execution time
        execution_time = end_time - start_time

        result = {
            "success": process.returncode == 0,
            "output": output.strip(),
            "error": error.strip(),
            "execution_time": round(execution_time, 4),
            "memory_usage_kb": round(memory_usage_kb, 4)
        }
    
    except subprocess.TimeoutExpired:
        process.kill()
        result = {
            "success": False,
            "output": "",
            "error": "Execution timed out!",
            "execution_time": 5.0,
            "memory_usage_kb": 0
        }
    
    finally:
        # Cleanup temp file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
    
    return result

# Example Usage
# code_with_error = """
# print("Hello World")
# for i in range(5):
#     print(i)
# """

# input_data = ""
# result = run_code(code_with_error, input_data)
# print(result)

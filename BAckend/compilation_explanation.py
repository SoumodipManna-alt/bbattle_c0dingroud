# import subprocess
# import tempfile
# import os
# import time
# from flask import Flask, request, jsonify

# app = Flask(__name__)

# @app.route('/compile', methods=['POST'])
# def compile_code():
#     data = request.json
#     code = data.get("code", "")

#     # Create a temporary Python file
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as temp:
#         temp.write(code.encode())
#         temp_filename = temp.name  # Store filename

#     try:
#         # Start measuring time
#         start_time = time.time()

#         # Run the Python compiler
#         process = subprocess.run(
#             ["python3", "-m", "py_compile", temp_filename],
#             capture_output=True, text=True
#         )

#         # Calculate the total compilation time
#         end_time = time.time()
#         compilation_time = end_time - start_time

#         # Check if compilation was successful
#         if process.returncode == 0:
#             result = {
#                 "success": True,
#                 "message": "Compilation successful!",
#                 "compilation_time": round(compilation_time, 4)  # Return time in seconds
#             }
#         else:
#             result = {
#                 "success": False,
#                 "message": process.stderr.strip(),
#                 "compilation_time": round(compilation_time, 4)
#             }
#     finally:
#         os.remove(temp_filename)  # Cleanup

#     return jsonify(result)

# if __name__ == '__main__':
#     app.run(debug=True)


# In Python, temp_filename = temp.name is used when working with temporary files using the tempfile module.

# Understanding temp.name
# temp.name returns the file path of the temporary file created.
# It allows you to access and use the file later in your program.




# @app.route('/run', methods=['POST'])
# def run_code():
#     data = request.json
#     code = data.get("code", "")
#     user_input = data.get("input", "")

#     # Create a temporary Python script
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as temp:
#         temp.write(code.encode())
#         temp_filename = temp.name

#     # ✅ Step 1: Check for Syntax Errors Before Running
#     try:
#         py_compile.compile(temp_filename, doraise=True)  # Raises error if syntax is invalid
#     except py_compile.PyCompileError as e:
#         os.remove(temp_filename)  # Cleanup
#         return jsonify({"success": False, "output": "", "error": f"Syntax Error: {str(e)}"})

#     # ✅ Step 2: Run the Code if No Syntax Errors
#     try:
#         process = subprocess.Popen(
#             ["python3", temp_filename],  
#             stdin=subprocess.PIPE,       
#             stdout=subprocess.PIPE,      
#             stderr=subprocess.PIPE,      
#             text=True
#         )

#         output, error = process.communicate(input=user_input, timeout=5)

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
#         os.remove(temp_filename)  # Cleanup

#     return jsonify(result)




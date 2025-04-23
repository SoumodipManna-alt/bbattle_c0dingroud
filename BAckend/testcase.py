# obj={"question":"find even odd number","testcases":{"testcase1":{"input1":4,"output":"true"}}}
# import time
# import tracemalloc

# # Example code snippets to compare
# solutions = {
#     "Solution 1": "def solve(n): return sum(range(n))",
#     "Solution 2": "def solve(n): return (n * (n - 1)) // 2"
# }

# # Test input
# test_input = 1000000  # Large input to test efficiency

# # Function to evaluate performance
# def evaluate_code(solution_code, test_input):
#     exec_globals = {}
#     exec(solution_code, exec_globals)  # Run the code snippet
#     solve_func = exec_globals["solve"]  # Extract function

#     # Measure execution time
#     start_time = time.time()
#     result = solve_func(test_input)
#     exec_time = time.time() - start_time

#     # Measure memory usage
#     tracemalloc.start()
#     solve_func(test_input)
#     memory_used = tracemalloc.get_traced_memory()[1]
#     tracemalloc.stop()

#     return result, exec_time, memory_used

# # Compare all solutions
# results = {}
# for name, code in solutions.items():
#     result, exec_time, memory = evaluate_code(code, test_input)
#     results[name] = {"Time": exec_time, "Memory": memory, "Output": result}

# # Print results
# for name, metrics in results.items():
#     print(f"\n{name}:")
#     print(f"Execution Time: {metrics['Time']:.6f} sec")
#     print(f"Memory Usage: {metrics['Memory']} bytes")
#     print(f"Output: {metrics['Output']}")


# data={"question":"xbcv","testcases":{
#             "testcase1":{"input1":4,"output1":True},
#             "testcase2":{"input2":5,"output2":False},
#             "testcase3":{"input3":0,"output3":True},
#             },
#         "question_time":30
#         }
# # print(data["testcases"].items())

# for key,value in data["testcases"].values():
#     print(key,value)
    
# in_ou={}   
# data1={
#     "testcases":{
#         "testcase1":{4:True},
#         "testcase2":{5:False}
#     }
# }
# # print(data1["testcases"].values())
# for value in  data1["testcases"].values():
#     input_value=(list(value.keys()))[0]# [0] because it is array and we extract value
#     output_value=(list(value.values()))[0]
#     in_ou[input_value]=output_value
    
# print()

# result=[('s@m', '4r6jb', 3, '0.1235', '0', '16'), ('r@m', '4r6jb', 3, '0.1404', '0', '30')]
# data=[list(row) for row in result]
# sorted_data = sorted(data, key=lambda x: (int(x[2]), float(x[3]), int(x[5])))
# print(sorted_data)

n=int(input())
if(n%2==0):
    print("True")
else:
    print("False")

n=int(input())
if(n==1):
    print("False")
else:
    print("True") 
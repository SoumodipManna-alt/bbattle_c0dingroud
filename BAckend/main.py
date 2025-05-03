from flask import Flask,jsonify,request
from flask_cors import CORS
import os,random
from connection_with_ssms import Store_login_info
from flask_socketio import SocketIO, join_room, leave_room
from flask_cors import CORS
from connection_with_ssms import Question_fetching,fetch_user_details
from Complie_and_Run import complie_and_run,Test_cases,fatching_result,solo_test

app=Flask(__name__)
CORS(app) 
app.secret_key = os.urandom(24)  # Generates a secure random key
socketio=SocketIO(app,cors_allowed_origins="*")

rooms={}
messages={}
submit_code={}
testcases={}
game_round={}
current_round={}
ready_state_username={}

@socketio.on("connect")
def handel_connect():
    print(f"a user connect:{request.sid}")
    
@socketio.on("disconnect")
def handel_disconnect():
    for room_id,user in list(rooms.items()):
        if request.sid in user:
            username=user.pop(request.sid)
            
        if not user:
            del rooms[room_id]
            
        else:
            socketio.emit("room_update",{"room":room_id,"user":list(user.values())},room=room_id)

        print(f"the {username} is disconnected")
        break
    
@socketio.on("create_room")
def create_room(data):
    print(data)
    room_id = data.get("room_id")
    username = data.get("username")
    round =data.get("round")
    if not room_id or not username:
        socketio.emit("error",{"message":"invalid room"},room=request.sid)
        return 
    rooms[room_id]={request.sid:username}
    game_round[room_id]=round
    messages[room_id]=[]
    join_room(room_id)
    
    socketio.emit("room_created",{"room_id":room_id,"round":round},room=request.sid)
    # print(join_room)
    # socketio.emit("room_update",{"room":room_id,"users":list(rooms[room_id].values())},room=room_id)

  
@socketio.on("join_room")
def handel_join_room(data):
    room_id = data.get("room_id")
    username = data.get("username")
    
    if not username or not room_id:
        socketio.emit("error",{"message":"invalid room"},room=request.sid)
        return

    if room_id not in rooms:
        rooms[room_id]={}
    
    if username not in rooms[room_id].values():
        rooms[room_id][request.sid]=username
    round=game_round[room_id]    
    join_room(room_id)
    socketio.emit("join_room_c",{"round":round,"room_id":room_id},room=room_id)
    socketio.emit("room_update",{"room":room_id,"user":list(rooms[room_id].values())},room=room_id)
    # socketio.emit("message_history", {"messages": list(messages.get(room_id, {}).values())}, room=request.sid)




@app.route("/login", methods=["POST"])
def login():
    data=request.json
    # print(data)
    if(not data):
        return jsonify({"message":"invalid data"})
    email=data.get("email")
    password=data.get("password")
    # print(email,password)
    Data=dict(email=email,password=password)
    responce=Store_login_info.connection_with_db('login',Data)
    if responce["message"]:
        return jsonify({"message":True,"data":responce["user_info"]})
    else:
        return jsonify({"message":False})
    
@app.route("/sign_up",methods=["POST"])
def sign_up():
    data=request.json
    if(not data):
        return jsonify({"message":"invalid data"})
    name=data.get("name")
    email=data.get("email")
    password=data.get("password")
    # print(name,email,password)
    Data=dict(name=name,email=email,password=password)
    responce=Store_login_info.connection_with_db('sign_up',Data)
    if(responce):     
    
        return jsonify({"value":True})
    else:
        return jsonify({"value":False})
        
@app.route('/message_submit',methods=["POST"])
def message_submit():
    data=request.json
    if(not data):
        return jsonify({"message":"invalid data"})
    room_id=data.get('roomid')
    user=data.get("user")
    msg=data.get("msg")
    if not room_id or not user or not msg:
        print("Error: Missing data")
        return jsonify({"error": "Invalid data"}), 400
    # if room_id not in messages:
    #     messages[room_id]={}
    # messages[room_id][user]=msg
    if room_id not in messages:
        messages[room_id] = []

    messages[room_id].append({'user': user, 'text': msg})

    # socketio.emit("new_message", {"room_id": room_id, "user": user, "msg": msg}, room=room_id)
    socketio.emit("new_message", {"room_id": room_id, "user": user, "msg": msg}, room=room_id)

    return jsonify({"success": True})

# @socketio.on("start_game")
# def handel_start_game(data):
    
#     room_id=data.get("room_id")
#     # users_on_room=list(rooms[room_id].values())
#     # print(len(users_on_room))
#     if room_id not in current_round:
#         current_round[room_id]=1
#     else:
#         current_round[room_id]+=1 
        
#     question_ids=random.randint(1,11)
#     print(question_ids)
#     socketio.emit("staring_game",{"question_ids":question_ids,"round":current_round[room_id]},room=room_id)

# @socketio.on("ready_or_not")
# def handle_ready_or_not(data):
#     room_id = data.get("room_id")
#     username = data.get("user")
#     if room_id not in ready_state_username:
#         ready_state_username[room_id] = []

#     if username not in ready_state_username[room_id]:
#         ready_state_username[room_id].append(username)

#     print("Ready Users:", ready_state_username[room_id], "length:", len(ready_state_username[room_id]))
#     print("Room Members:", list(rooms[room_id].values()), "length:", len(list(rooms[room_id].values())))

#     if len(ready_state_username[room_id]) == len(list(rooms[room_id].values())):
#         ready_state_username[room_id]=[]
#         socketio.emit("ready_all_user", {}, room=room_id)

@socketio.on("player_ready_toggle")
def handel_player_ready_toggle(data):
    username=data.get("username")
    room_id=data.get("room_id")
    status=data.get("ready")
    if room_id not in ready_state_username:
        ready_state_username[room_id]={}
    if username not in ready_state_username[room_id]:
        ready_state_username[room_id][username]=status

@socketio.on("start_game")
def handel_start_game(data):
    
    room_id=data.get("room_id")
    users_on_room=list(rooms[room_id].values())
    print("players in room ",len(users_on_room))
    
        
    question_ids=random.randint(1,4)
    print("ready player",ready_state_username[room_id].items())
    if len(list(rooms[room_id].values()))==len(list(ready_state_username[room_id].values())):
            # print(ready_state_username[room_id])
            if False in list(ready_state_username[room_id]):
                socketio.emit("palyer_not_ready",room=room_id)
            else:
                if room_id not in current_round:
                    current_round[room_id]=1
                else:
                    current_round[room_id]+=1 
        
                    
                socketio.emit("staring_game",{"question_ids":question_ids,"round":current_round[room_id]},room=room_id)
                ready_state_username[room_id]={}

    else:
        socketio.emit("palyer_not_ready",room=room_id)
    
@app.route("/code_run",methods=["POST"])
def code_run():
    data=request.json
    code=data.get("code")
    input=data.get("input","")
    result=complie_and_run.run_code(code,input)
    return jsonify(result),200
@app.route("/question_genarate",methods=["POST"])
def question_genarate():
    data=request.json
    room_id=data.get("room_id")
    question_ids=data.get("question_ids",1)
    random_number = 1 
    data,input_output_pairs=Question_fetching.question_fetch(question_ids)
    if room_id not in testcases:
        testcases[room_id]=input_output_pairs
        # print(data["question"])
    return jsonify({"question":data["question"],"testcases":input_output_pairs,"question_time":data["question_time"]})
@app.route("/code_submit",methods=["POST"])
def code_submit():
    data=request.json
    code=data.get("code")
    user_email=data.get("user_email")
    room_id=data.get("room_id")
    time=data.get("time")
    question_ids=data.get("question_ids")
    result=Test_cases.check_testcases(testcases[room_id],code,user_email,room_id,time,current_round[room_id],question_ids)
    if room_id not in submit_code:
        submit_code[room_id]={}
        
    round=current_round[room_id]
    print(current_round[room_id])
    if round not in submit_code[room_id]:
        submit_code[room_id][round]={}
    submit_code[room_id][round][user_email]=code
    if user_email not in submit_code[room_id]:
        submit_code[room_id][user_email]=code
    # if(len(list(rooms[room_id].values()))==len(list(submit_code[room_id].values()))):
    if len(submit_code[room_id][round])==len(rooms[room_id]):
        Test_cases.performance_check(room_id,round)
        socketio.emit("all_user_submitted",{"room_id":room_id,"round":round},room=room_id)
    # else:
    #     socketio.emit("waiting_for_others",room=room_id)
    print("game round",game_round[room_id],"total round",current_round[room_id])
    if int(game_round[room_id])==int(current_round[room_id]):
        
        return jsonify({"message":True})
    else:
        return jsonify({"message":False,"remaining_round":int(game_round[room_id])-int(current_round[room_id])})    
        
    # print (len(submit_code[room_id][round]))
    # print(rooms[room_id])
    # # print(code,room_id)
    # print(submit_code)
    # print(result)
    
    
    
@app.route("/result_showing",methods=["POST"])
def result_showing():
    data=request.json
    room_id=data.get("room_id")
    round=data.get("round")
    print("hi",room_id,round)

    result,status=fatching_result.result_fetch(room_id,round)
    if status==0:
        return jsonify({"result":result,"message":""})
    elif status==1:
        return jsonify({"result":result,"message":"all user are not submited yet , plz wait"})
@app.route("/profile",methods=["POST"])
def profile_detailts():
    data=request.json
    email=data.get("email")
    data,history=fetch_user_details.user_details(email)
    return jsonify({"data":data,"history":history})

@app.route("/solo_submit",methods=["POST"])
def solo_submit():
    data=request.json
    room_id=data.get("room_id")
    code=data.get("code")
    result=solo_test.submit_solo(testcases[room_id],code)
    return result
if __name__==('__main__'):
    socketio.run(app,host="0.0.0.0",port=5000,debug=True)
import sys
import time
from dotenv import load_dotenv
import os
import dotenv
from hard_controls import camera_controls, mic_controls, lcd_controls
from soft_controls import get_ips, jtalk, speech_to_text
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
import uvicorn
from typing import List
import json
import asyncio
import requests
from concurrent.futures import ThreadPoolExecutor
import RPi.GPIO as GPIO # RPi.GPIOモジュールを使用
from hard_controls.servo_controls import Move

app = FastAPI(
    title="Spyder"
)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

# _dir = os.getcwd().split("/")[-1]

class ESendActions: 
    updateFrame = "frame"
    sendMessage = "message"
    moveBodyOrder = "move_body"
    stopBodyOrder = "stop_body"
    moveCameraOrder = "camera_body"
    stopCameraOrder = "camera_body"


class ESpyderStatus:
    safety = 0
    activate = 1

class SpyderManager:
    """ 本体のハード操作 """
    def __init__(self):
        self.mode = ESpyderStatus.safety # 0:safety or 1:acticate
        self.front_servo1 = ""
        self.recent_data = None
        # GPIO操作で扱うデータ
        self.key_switch = 5
        self.button_switch = 6
        self.feature = None
        self.end = False
        # 本体の操作
        self.control = Move.Control()

    def set_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.key_switch, GPIO.IN)
        GPIO.setup(self.button_switch, GPIO.IN)

    def get_gpio(self, pin_number):
        return GPIO.input(pin_number)

    def clear_gpio(self):
        self.end = True
        time.sleep(0.5)
        GPIO.cleanup()
    
    def start_gpio(self):
        while True:
            try:
                time.sleep(1)
                if self.end:
                    print("GPIO Close")
                    self.close_gpio()
                    break
                # print(self.get_gpio(self.key_switch), self.get_gpio(self.button_switch))
                if self.get_gpio(self.key_switch) and self.mode==ESpyderStatus.safety:
                    self.mode = ESpyderStatus.activate
                    jtalk.start_jtalk("システムアクティベート")
                    jtalk.start_jtalk("すべての利用権限を付与します。")
                
                if self.get_gpio(self.key_switch) == 0 and self.mode==ESpyderStatus.activate:
                    self.mode = ESpyderStatus.safety
                    jtalk.start_jtalk("システムセーフティモード")
                    jtalk.start_jtalk("一部の操作のみを許可します。")
                
                if self.get_gpio(self.button_switch) and self.mode == ESpyderStatus.activate:
                    self.clear_lcd()
                    ip = get_ips.get_ip()
                    self.set_lcd_text(("IPADDRESS", ip))
            except Exception as e:
                print(str(e))

    def start_feature(self, executor):
        feature = executor.submit(
            self.start_gpio
        )
        self.set_gpio_feature(feature)

    def set_gpio_feature(self, feature):
        self.feature = feature

    def close_gpio(self):
        if self.feature:
            self.feature.cancel()
        self.end = True

    def set_recent_data(self, recent_data):
        self.recent_data = recent_data
        self.end = True
    
    def get_recent_data(self):
        return self.recent_data

    def set_lcd_text(self, texts: tuple = ("Hello", "World")):
        lcd_controls.lcd_string(texts[0], 1)
        lcd_controls.lcd_string(texts[1], 2)

    def clear_lcd(self):
        lcd_controls.lcd_init()


class SpeakRecognitionManager:
    """ 音声認識マネージャー """
    def __init__(self):
        self.connectedNetwork = False
        self.recognitions = []
        self.new_recognitions = []
        self.feature = None
        self.end = False

    # ネットワークへの接続を確認
    def is_connect(self):
        if not self.connectedNetwork:
            r = requests.get("https://www.google.com", timeout=5)
            self.connectedNetwork = True if r.status_code == 200 else False
        return self.connectedNetwork

    def start_recognitions(self):
        while True:
            try:
                if self.end:
                    break
                audio_source = mic_controls.mic_get_audio_stream(
                    record_type=mic_controls.RecordType.WhileThreads, 
                    record_secs=5, 
                    record_thread=0.01, 
                    is_save=False, 
                    output_name="recognision.wav"
                )
                if self.end:
                    break
                text = speech_to_text.speech_to_text(audio_source)
                if text and len(text) > 0:
                    print("## 音声認証結果")
                    print(text)
                    self.set_recognitions(text)
                time.sleep(1)
            except Exception as e:
                print(str(e))

    def get_recognitions(self):
        return self.recognitions

    def set_recognitions(self, text):
        self.recognitions.append(text)
        self.new_recognitions.append(text)

    def get_new_recognitions(self):
        return self.new_recognitions

    def delete_new_recognitions(self, text):
        self.new_recognitions = [nr for nr in self.new_recognitions if nr != text]
        return self.new_recognitions

    def start_feature(self, executor):
        feature = executor.submit(
            self.start_recognitions
        )
        self.set_feature(feature)

    def set_feature(self, feature):
        self.feature = feature

    def close_feature(self):
        print("Close SpeakRecognition")
        if self.feature:
            self.feature.cancel()
        self.end = True

class ConnectionManager:
    """Webソケットマネージャー"""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

conn_mgr = ConnectionManager()
spyder = SpyderManager()
spyder.set_gpio()
speak_reg = SpeakRecognitionManager()

@app.websocket("/ws/{client_id}")
async def process_ws(websocket: WebSocket, client_id: int):
    """ カメラデータの取得 と データの取得 """
    print("## StartWebSocket")
    await conn_mgr.connect(websocket)
    try:
        while True:
            data_string = await websocket.receive_text()
            data = json.loads(data_string)
            if not spyder.get_recent_data() == data_string:
                spyder.set_recent_data(data_string)
            else:
                continue

            res = {
                "image_base64": None,
            }

            try:
                actions = data["actions"]
                if not len(actions) >= 1:
                    continue

                print(data)# データの確認

                for action in actions:  
                    # Convert to PIL image
                    if action == "frame":
                        # 画像の取得
                        pil_image = camera_controls.get_capture()
                        res["image_base64"] = camera_controls.convert_pil_to_base64(pil_image=pil_image) 
                    
                    if action == ESendActions.sendMessage:
                        # 読み上げ
                        if data["message"] and len(data["message"]) > 0:
                            jtalk.start_jtalk(data["message"])

                    if action == ESendActions.moveBodyOrder:
                        # きたいのそうさ
                        x_ratio = data["x_ratio"]
                        y_ratio = data["y_ratio"]
                        speed   = data["speed"]
                        spyder.control.move_run(
                            cmd=Move.COMMAND.CMD_MOVE,
                            gait=0,
                            x_coord=x_ratio*100,
                            y_coord=y_ratio*100,
                            speed=speed,
                            angle=0
                        )
                        
            except Exception as e:
                print(f"## ERROR = {str(e)}")
                import traceback
                traceback.print_exc()
                pass

            time.sleep(0.001)

            # Send back the result
            await conn_mgr.send_message(json.dumps(res), websocket)

            # await conn_mgr.broadcast(f"Client #{client_id} says: {data}")

    except WebSocketDisconnect:
        print("WebSocket Error!")
        import traceback as tb
        tb.print_exc()
        conn_mgr.disconnect(websocket)
        await conn_mgr.broadcast(f"Client #{client_id} left the chat")

app.mount(
    "/", 
    StaticFiles(directory=f"build", html=True), 
    name="html"
)

# マルチプロセッサの設定数
executor = ThreadPoolExecutor(max_workers=5)

# マルチスレッドで音声認識をOnにする
if speak_reg.is_connect():
    speak_reg.start_feature(executor)

# マルチスレッドSpyderを接続する
spyder.start_feature(executor)




if __name__ == "__main__":
    port = 8000
    # if len(sys.argv) > 1:
    if True:
        ## 初期設定
        load_dotenv(override=True)
        dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
        load_dotenv(dotenv_path)
        APIURL = os.environ.get("REACT_APP_APIURL")
        dotenv_file = dotenv.find_dotenv()
        ip = get_ips.get_ip()
        value = ip if ip else ip 
        dotenv.set_key(dotenv_file, "REACT_APP_APIURL", f"https://{value}:{port}/")
        
        # サーバーを起動する
        print("### Hosting ###")
        print(f"https://{value}:{port}/")
        uvicorn.run(
            app="main:app", 
            host="0.0.0.0", 
            port=port,
            ssl_keyfile="./server.key",
            ssl_certfile="./server.crt",
            reload=True
        )
    else:
        ## 初期設定
        load_dotenv(override=True)
        dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
        load_dotenv(dotenv_path)
        APIURL = os.environ.get("REACT_APP_APIURL")
        dotenv_file = dotenv.find_dotenv()
        ip = "localhost"
        value = ip if ip else ip 
        dotenv.set_key(dotenv_file, "REACT_APP_APIURL", f"http://{value}:{port}/")
        
        # サーバーを起動する
        print("### Hosting ###")
        print(f"http://{value}:{port}/")
        uvicorn.run(app=app)

print("SYSTEM END")
spyder.control.relax()
camera_controls.camera.close()
speak_reg.close_feature()
spyder.close_gpio()
executor.shutdown(wait=False)
import time
from dotenv import load_dotenv
import os
import dotenv
from hard_controls import camera_controls
from soft_controls import get_ips
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
import uvicorn
from typing import List
import json

app = FastAPI(
    title="Spyder"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

_dir = os.getcwd().split("/")[-1]
print(_dir)
app.mount(
    "/", 
    StaticFiles(directory=f"build", html=True), 
    name="html"
)


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


@app.websocket("/camera/{client_id}")
async def process_camera_ws(websocket: WebSocket, client_id: int):
    """ カメラデータの取得 と データの取得 """
    await conn_mgr.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print("## 取得データの確認 ##")
            print(data)

            # Convert to PIL image
            pil_image = camera_controls.get_capture()

            result = {
                "image_base64": camera_controls.convert_pil_to_base64(pil_image=pil_image) 
            }

            # Send back the result
            await conn_mgr.send_message(json.dumps(result), websocket)

            # await conn_mgr.broadcast(f"Client #{client_id} says: {data}")

    except WebSocketDisconnect:
        conn_mgr.disconnect(websocket)
        await conn_mgr.broadcast(f"Client #{client_id} left the chat")


if __name__ == "__main__":
    port = 8888
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
        app=app, 
        host="0.0.0.0", 
        port=port,
        ssl_keyfile="./server.key",
        ssl_certfile="./server.crt"
    )
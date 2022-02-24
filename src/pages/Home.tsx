import React, { Fragment, useRef } from "react";
import { ArwesThemeProvider, StylesBaseline, Figure, FrameBox, Text, Button } from "@arwes/core";
import { AnimatorGeneralProvider } from "@arwes/animation";
import { BleepSettings, BleepsProvider } from "@arwes/sounds";
import { ButtonComponent } from "../components/Button";
import styles from "../App.module.scss";
import { Joystick } from "react-joystick-component";
import { InputComponent } from "../components/Input";
import { Row, Col } from 'antd';
import { DownOutlined, UpOutlined, ExclamationOutlined, BellFilled, LogoutOutlined } from "@ant-design/icons";
import {Card, FrameLines} from "@arwes/core/lib";
import { useHistory } from 'react-router-dom';

const ROOT_FONT_FAMILY = '"Titillium Web", sans-serif';
const IMAGE_URL = '/assets/images/wallpaper.jpg';
const SOUND_OBJECT_URL = '/assets/sounds/object.mp3';
const SOUND_TYPE_URL = '/assets/sounds/type.mp3';

// --  Settings -- //
const animatorGeneral = { duration: { enter: 200, exit: 200 } };
const audioSettings = { common: { volume: 1.00 } };
const playersSettings = {
  object: { src: [SOUND_OBJECT_URL] },
  type: { src: [SOUND_TYPE_URL], loop: true }
};
const bleepsSettings = {
  object: { player: 'object' },
  type: { player: 'type' }
};
const capTimerMS = 2500;
// -- -------- -- //

interface IMessage {
    user: "Customer"| "Spyder" | "Administrator";
    message: string;
}

export enum ESendActions {
    updateFrame = "frame",
    sendMessage = "message",
    moveBodyOrder = "move_body",
    stopBodyOrder = "stop_body",
    moveCameraOrder = "camera_body",
    stopCameraOrder = "camera_body",
}

export const HomeComponent: React.FC = () => {

    const ws = useRef(null);

    const [state, setState] = React.useState({
        frameCount: 0,
        isPaused: false,
        captureImage: null,
        stickSize: 150,
        isMessageInput: false,
        isWorking: false,
        messageText: "",
        messages: [],
        messageHistoryView: true,
        isStart: false,
        isNew: false,
        openInformation: false,
        autoCameraAxis: false,
        relaxMode: false,
        recognition: {
            // username: "",
            // department: "",
            // job: "",
            // address: "",
            // image_base64: "",
            username     : "Sho Osaka",
            department   : "Departments",
            job          : "Programmer",
            address      : "Address",
            image_base64 : "",
        }
    });

    const sendWSCameraUpdate = () => {
        if (!ws.current) return;
        try {
            ws.current.send(JSON.stringify({"actions": [ESendActions.updateFrame], "frame": state.frameCount}));
            setState({...state, frameCount: state.frameCount + 1});
        }
        catch(e){}
    }

    React.useEffect(() => {
        // WebSocketの連結
        const client_id = Date.now();
        try {
            const url = `${process.env.REACT_APP_APIURL}ws/${client_id}`.replace("https://", "wss://").replace("http://", "ws://");
            ws.current = new WebSocket(url);
            ws.current.onopen = () => {
                console.log("ws opened");
            }
            ws.current.onclose = () => {
                console.log("ws closed");
            };
            return () => {
                ws.current.close();
            };
        }
        catch(e){
            console.log("Error Close");
        }
        setTimeout(() => { setState({...state, isStart: true }) }, 1000);
    }, []);

    React.useEffect(() => {
        if (!ws.current) return;
    
        // サーバーからデータ取得
        ws.current.onmessage = (event) => {
          if (event && event.data){
              const data = JSON.parse(event.data);
              let update_state = {};
              if (data.image_base64){
                  update_state["captureImage"] = data["image_base64"]
              }
              if (data.is_working){
                update_state["isWorking"] = data["is_working"].toString()=="True"? true: false;
              }
              setState({
                  ...state,
                  ...update_state
              });
          }
        };
        const intervalId = setInterval(() => {
            sendWSCameraUpdate()
        }, capTimerMS);
        return () => {
            clearInterval(intervalId);
        };

    }, [state]);

    /**
     * メッセージ送信
     */
    const sendWSData = (data) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify(data));
    }

    /**
     * 左スティック動作時
     * @param event
     */
    const leftStickMove = (event) => {
        const val = convertMoveValue(event);
        const data = {
            actions: [ESendActions.moveBodyOrder],
            x_ratio: val.x_ratio,
            y_ratio: val.y_ratio,
            speed: val.speed,
        };
        if (state.isWorking) return;
        sendWSData(data);
    }

    /**
     * 左スティック停止時
     * @param event
     */
    const leftStickStop = (event) => {
        const val = convertMoveValue(event);
        const data = {
            actions: [ESendActions.stopBodyOrder],
            x_ratio: val.x_ratio,
            y_ratio: val.y_ratio,
            speed: val.speed,
        };
        if (state.isWorking) return;
        sendWSData(data);
    }

    /**
     * 【カメラ向き操作】
     * 右スティック動作時
     * @param event
     */
    const rightStickMove = (event) => {
        const val = convertMoveValue(event);
        const data = {
            actions: [ESendActions.moveCameraOrder],
            x_ratio: val.x_ratio,
            y_ratio: val.y_ratio,
            speed: val.speed,
        };
        if (state.isWorking) return;
        sendWSData(data);
    }

    /**
     * 右スティック停止時
     * @param event
     */
    const rightStickStop = (event) => {
        if (!state.autoCameraAxis){
            const val = convertMoveValue(event);
            const data = {
                actions: [ESendActions.moveBodyOrder],
                x_ratio: val.x_ratio,
                y_ratio: val.y_ratio,
                speed: val.speed,
            };
            if (state.isWorking) return;
            sendWSData(data);
        }
    }

    const convertMoveValue = (event) => {
        const speed = event.distance;
        const x = Math.abs(event.x/100) > 1? (event.x/100 > 0? 0.99: -0.99): event.x/100;
        const y = Math.abs(event.y/100) > 1? (event.y/100 > 0? 0.99: -0.99): event.y/100;
        const x_ratio = speed/100 * x;
        const y_ratio = speed/100 * y;
        return {
            x_ratio: x_ratio,
            y_ratio: y_ratio,
            speed  : speed
        }
    }

    const getSize = () => {
        const h = window.parent.screen.height;
        return Number(h/5)
    }

    /**
     * メッセージ送信
     */
    const sendMessage = () => {
        const data = {
            actions: [ESendActions.sendMessage],
            message: state.messageText
        }
        sendWSData(data);
        const messages: IMessage[] = state.messages;
        if (state.messageText.length > 0){
            messages.push({
                user: "Administrator",
                message: state.messageText
            });
        }

        setState({ ...state, messageText: "", messages: messages });
    }

    return (
        <Fragment>
            <div className={styles.home}>
                <ArwesThemeProvider>
                    <StylesBaseline styles={{ body: { fontFamily: ROOT_FONT_FAMILY } }} />
                    <BleepsProvider
                        audioSettings={audioSettings}
                        playersSettings={playersSettings}
                        bleepsSettings={bleepsSettings}
                    >
                        <AnimatorGeneralProvider animator={{ duration: { enter: 200, exit: 200 }}}>
                            <div className={styles.controlTouchView}>
                            {state.isMessageInput &&
                                <div className={styles.messageInput}>
                                    <>
                                        <Row>
                                            <Col span={24}>
                                                <FrameLines>
                                                    <input
                                                        type={"text"}
                                                        onInput={
                                                            (e: any) => {
                                                                setState({...state, messageText: e.target.value});
                                                            }
                                                        }
                                                        value={state.messageText}
                                                    />
                                                </FrameLines>
                                            </Col>
                                        </Row>
                                        <Row style={{textAlign: "center"}}>
                                            <span>
                                                <Button
                                                    animator={{ activate: state.isStart }}
                                                    onClick={() => {
                                                        setState({...state, isMessageInput: false, messageText: "" })
                                                    }}
                                                >
                                                    <Text>CANCEL</Text>
                                                </Button>
                                            </span>
                                            <span>
                                                <Button
                                                    animator={{ activate: state.isStart }}
                                                    onClick={() => {
                                                        sendMessage()
                                                    }}
                                                >
                                                    <Text>Message SEND</Text>
                                                </Button>
                                            </span>
                                        </Row>
                                    </>

                                </div>
                            }
                                <div className={styles.messageTrig}>
                                    <Button
                                        onClick={() => {
                                            setState({...state, isMessageInput: !state.isMessageInput})
                                        }}
                                    >
                                        <Text>Chat Message</Text>
                                    </Button>
                                </div>
                                <div className={styles.messageHistory}>
                                    <FrameBox>
                                        <div className={styles.content}>
                                            [ Messages ]
                                            <span>
                                                <DownOutlined />
                                            </span>
                                        </div>
                                        {state.messageHistoryView &&
                                            <div className={styles.content}>
                                                {state.messages.map(mes => {
                                                    return (
                                                        <div>
                                                            {`${mes.user}>> ${mes.message}`}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        }
                                    </FrameBox>
                                </div>
                                <div className={styles.informationViewer}>
                                    <div className={styles.icon}
                                         onClick={() =>
                                             setState({...state, openInformation: !state.openInformation })
                                         }
                                    >
                                        <ExclamationOutlined />
                                    </div>
                                    {state.isNew &&
                                        <div className={styles.badge}>
                                            <BellFilled />
                                        </div>
                                    }
                                    {state.openInformation &&
                                        <div className={styles.information}>
                                            {state.recognition.username.length>0 &&
                                                <Card
                                                    animator={{ duration: { enter: 200, exit: 200 }}}
                                                    image={{
                                                      src: state.recognition.image_base64,
                                                      alt: 'FaceImage'
                                                    }}
                                                    title={state.recognition.username}
                                                    options={
                                                      <Button palette='secondary'>
                                                        <Text>Contact</Text>
                                                      </Button>
                                                    }
                                                    style={{ maxWidth: 400, minWidth: 250 }}
                                                >
                                                    <Text>
                                                        Dept: {state.recognition.department}
                                                        <br/>
                                                        Jobs: {state.recognition.job}
                                                        <br/>
                                                        Addr: {state.recognition.address}
                                                        <br/>
                                                    </Text>
                                                </Card>
                                            }
                                        </div>
                                    }
                                </div>
                                <div className={styles.functionalArea}>
                                    <div className={styles.title}>
                                        <FrameLines>
                                            <Text className={styles.name}>
                                                Main Monitor
                                            </Text>
                                            <Button>
                                                <LogoutOutlined />
                                            </Button>
                                        </FrameLines>
                                    </div>
                                </div>
                                <div className={styles.joystickLeft}>
                                    <div className={styles.sub}>
                                        <Text className={styles.name}>Move</Text>
                                        <Button FrameComponent={FrameBox} onClick={() => {
                                            setState({...state, relaxMode: !state.relaxMode})
                                        }}>
                                            <Text>
                                                {state.relaxMode? "RELAX": "RUN"}
                                            </Text>
                                        </Button>
                                    </div>
                                    <Joystick
                                        size={getSize()}
                                        sticky={false}
                                        baseColor="#ffffff22"
                                        stickColor="rgb(0 240 255)"
                                        move={leftStickMove}
                                        stop={leftStickStop}
                                    ></Joystick>
                                </div>
                                <div className={styles.joystickRight}>
                                    <div className={styles.sub}>
                                        <Text className={styles.name}>Camera</Text>
                                        <Button FrameComponent={FrameBox} onClick={() => {
                                            setState({...state, autoCameraAxis: !state.autoCameraAxis})
                                        }}>
                                            <Text>
                                                {state.autoCameraAxis? "Auto": "Fixed"}
                                            </Text>
                                        </Button>
                                    </div>
                                    <Joystick
                                        size={getSize()}
                                        sticky={!state.autoCameraAxis}
                                        baseColor="#ffffff22"
                                        stickColor="#CCCCFF"
                                        move={rightStickMove}
                                        stop={rightStickStop}
                                    ></Joystick>
                                </div>
                            </div>

                            <div className={styles.cameraView}>
                                <Figure
                                    src={state.captureImage? state.captureImage: IMAGE_URL}
                                    alt=''
                                    fluid
                                >
                                Product No: SPY-MODEL-A1 SYSTEM Control Panel.
                                </Figure>
                        </div>
                        </AnimatorGeneralProvider>
                    </BleepsProvider>
                </ArwesThemeProvider>
            </div>
        </Fragment>
    )
}
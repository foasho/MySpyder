import React, { Fragment, useRef } from "react";
import { ArwesThemeProvider, StylesBaseline, Figure, FrameBox, Text } from "@arwes/core";
import { AnimatorGeneralProvider } from "@arwes/animation";
import { BleepSettings, BleepsProvider } from "@arwes/sounds";
import { ButtonComponent } from "../components/Button";
import styles from "../App.module.scss";
import { Joystick } from "react-joystick-component";
import { InputComponent } from "../components/Input";
import { Row, Col } from 'antd';
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const ROOT_FONT_FAMILY = '"Titillium Web", sans-serif';
const IMAGE_URL = '/assets/images/wallpaper.jpg';
const SOUND_OBJECT_URL = '/assets/sounds/object.mp3';
const SOUND_TYPE_URL = '/assets/sounds/type.mp3';

const audioSettings = { common: { volume: 1.00 } };
const playersSettings = {
  object: { src: [SOUND_OBJECT_URL] },
  type: { src: [SOUND_TYPE_URL], loop: true }
};
const bleepsSettings = {
  object: { player: 'object' },
  type: { player: 'type' }
};

interface IMessage {
    user: "Customer"| "Spyder" | "Administrator";
    message: string;
}

export const HomeComponent: React.FC = () => {
    
    const ws = useRef(null);

    const [state, setState] = React.useState({
        frameCount: 0,
        isPaused: false,
        captureImage: null,
        stickSize: 150,
        isMessageInput: false,
        messageText: "",
        messages: [],
        messageHistoryView: true
    });

    const sendWSCameraUpdate = () => {
        if (!ws.current) return;
        try {
            ws.current.send(JSON.stringify({"actions": [`frame`], "frame": state.frameCount}));
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
              setState({
                  ...state,
                  ...update_state
              });
          }
        };

        const intervalId = setInterval(() => {
            sendWSCameraUpdate()
        }, 250);
        return () => {
            clearInterval(intervalId);
        };

    }, [state]);

    const sendWSData = () => {
        if (!ws.current) return;
        const data = {
            actions: ["message"],
            message: state.messageText
        }
        ws.current.send(JSON.stringify(data));
    }

    const leftStickMove = (event) => {
        console.log(event);
    }

    const leftStickStop = (event) => {
        console.log(event);
    }

    const rightStickMove = (event) => {
        console.log(event);
    }

    const rightStickStop = (event) => {
        console.log(event);
    }

    const getSize = () => {
        const h = window.parent.screen.height;
        return Number(h/5)
    }

    const sendMessage = () => {
        sendWSData();
        setState({...state, messageText: ""})
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
                        <div className={styles.controlTouchView}>
                            {state.isMessageInput &&
                                <div className={styles.messageInput}>

                                    <>
                                        <Row>
                                            <Col span={24}>
                                                <InputComponent 
                                                    value={state.messageText}
                                                    onChange={(text: string) => {
                                                        setState({...state, messageText: text});
                                                    }}
                                                ></InputComponent>
                                            </Col>
                                        </Row>
                                        <Row style={{textAlign: "center"}}>
                                            <span>
                                                <ButtonComponent 
                                                    text={"CANCEL"} 
                                                    type="frame"
                                                    onClick={() => {
                                                        setState({...state, isMessageInput: false, messageText: "" })
                                                    }}
                                                ></ButtonComponent>
                                            </span>
                                            <span>
                                                <ButtonComponent 
                                                    text={"Message SEND "} 
                                                    type="frame"
                                                    onClick={() => {
                                                        sendMessage()
                                                    }}
                                                ></ButtonComponent>
                                            </span>
                                        </Row>
                                    </>
                                
                                </div>
                            }
                            <div className={styles.messageTrig}>
                                <ButtonComponent 
                                    type="basic"
                                    text={"Chat"} 
                                    onClick={() => setState({...state, isMessageInput: !state.isMessageInput})}
                                ></ButtonComponent>
                            </div>
                            <div className={styles.messageHistory}>
                                <AnimatorGeneralProvider animator={{ duration: { enter: 200, exit: 200 }}}>                                
                                    <FrameBox>
                                        <div className={styles.content}>
                                            [ Messages ]   
                                            <span>
                                                <DownOutlined />
                                            </span> 
                                        </div>
                                        {state.messageHistoryView && 
                                            <div>
                                                {state.messages.map(mes => {
                                                    return (
                                                        <>
                                                            {`${mes.user}>> ${mes.message}`}
                                                        </>
                                                    )
                                                })}
                                            </div>
                                        }
                                    </FrameBox>
                                </AnimatorGeneralProvider>
                            </div>
                            <div className={styles.functionalBtn}>
                                <Row>
                                    <Col></Col>
                                    <Col></Col>
                                    <Col></Col>
                                </Row>
                            </div>
                            <div className={styles.joystickLeft}>
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
                                <Joystick 
                                    size={getSize()} 
                                    sticky={false} 
                                    baseColor="#ffffff22" 
                                    stickColor="rgb(0 240 255)" 
                                    move={rightStickMove} 
                                    stop={rightStickStop}
                                ></Joystick>
                            </div>
                        </div>
                        <div className={styles.cameraView}>
                            {state.captureImage &&
                                <Figure
                                    src={state.captureImage}
                                    alt='Capture From Spyder'
                                    fluid
                                >
                                A nebula is an interstellar cloud of dust, hydrogen, helium and
                                other ionized gases.
                                </Figure>
                            }
                        </div>
                    </BleepsProvider>
                </ArwesThemeProvider>
            </div>
        </Fragment>
    )
}
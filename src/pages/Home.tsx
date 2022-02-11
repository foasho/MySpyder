import React, { Fragment, useRef } from "react";
import { ArwesThemeProvider, StylesBaseline, Figure } from "@arwes/core";
import { BleepSettings, BleepsProvider } from "@arwes/sounds";
import { ButtonComponent } from "../components/Button";
import styles from "../App.module.scss";
import { Joystick } from "react-joystick-component";

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

export const HomeComponent: React.FC = () => {
    
    const ws = useRef(null);

    const [state, setState] = React.useState({
        isPaused: false,
        captureImage: null,
        stickSize: 150,
    });

    const sendWSCameraUpdate = () => {
        if (!ws.current) return;
        try {
            ws.current.send("");
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
          if (state.isPaused) return;
          const message = JSON.parse(event.data);
          setState({
              ...state,
              captureImage: message.image_base64
          })
        };

        setInterval(sendWSCameraUpdate, 1000);

    }, [state]);

    const sendWSMessage = (msg: string) => {
        if (!ws.current) return;
        ws.current.send(msg);
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
                            <div className={styles.messageTrig}>
                                <ButtonComponent 
                                    text={"Chat"} 
                                    onClick={() => sendWSMessage("TEST")}
                                ></ButtonComponent>
                            </div>
                            <div className={styles.joystickLeft}>
                                <Joystick 
                                    size={getSize()} 
                                    sticky={false} 
                                    baseColor="#ffffff22" 
                                    stickColor="#000" 
                                    move={leftStickMove} 
                                    stop={leftStickStop}
                                ></Joystick>
                            </div>
                            <div className={styles.joystickRight}>
                                <Joystick 
                                    size={state.stickSize} 
                                    sticky={false} 
                                    baseColor="#ffffff22" 
                                    stickColor="#000" 
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
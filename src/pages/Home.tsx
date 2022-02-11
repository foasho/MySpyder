import React, { Fragment, useRef } from "react";
import { ArwesThemeProvider, StylesBaseline, Figure } from "@arwes/core";
import { BleepSettings, BleepsProvider } from "@arwes/sounds";
import { ButtonComponent } from "../components/Button";
import styles from "../App.module.scss";

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

const joyOptions = {
    mode: 'semi',
    catchDistance: 150,
    color: 'white'
}


export const HomeComponent: React.FC = () => {

    const ws = useRef(null);

    const [state, setState] = React.useState({
        isPaused: false,
        captureImage: null,
    });

    const sendWSCameraUpdate = () => {
        if (!ws.current) return;
        ws.current.send("");
    }

    React.useEffect(() => {
        // WebSocketの連結
        const client_id = Date.now();
        const url = `${process.env.REACT_APP_APIURL}ws/${client_id}`.replace("https://", "wss://").replace("http://", "ws://");
        ws.current = new WebSocket(url);
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");
        return () => {
            ws.current.close();
        };
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

        setInterval(sendWSCameraUpdate, 100);

      }, [state]);

    const sendWSMessage = (msg: string) => {
        if (!ws.current) return;
        ws.current.send(msg);
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
                            {/* <ButtonComponent text={"test"} onClick={() => sendWSMessage("TEST")}></ButtonComponent> */}
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
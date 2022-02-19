import React, { Fragment, useRef } from "react";
import { ArwesThemeProvider, StylesBaseline, Figure, FrameBox, Text, Button } from "@arwes/core";
import { AnimatorGeneralProvider } from "@arwes/animation";
import { BleepSettings, BleepsProvider } from "@arwes/sounds";
import styles from "../App.module.scss";
import {FrameLines} from "@arwes/core/lib";

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
// -- -------- -- //

export const LoginComponent: React.FC = () => {

    const privateLength = 4;

    const [state, setState] = React.useState({
        password: "",
        isLogin : false,
        len: 0,
        isStart: false,
    });

    React.useEffect(() => {
        setTimeout(() => { setState({...state, isStart: true }) }, 1000);
    }, []);

    const checkPassword = (inputValue: string) => {
        let password = state.password + inputValue.replace(/\*/g, "");
        console.log(password);
        let isLogin = state.isLogin;
        if (password.length == privateLength){
            if (password == process.env.REACT_APP_PWD){
                console.log("LogIn");
                isLogin = true;
            }
        }
        setState({ ...state, password: password, isLogin: isLogin, len: password.length });
    }

    return (
        <Fragment>
            <div className={styles.login}>
                <ArwesThemeProvider>
                    <StylesBaseline styles={{ body: { fontFamily: ROOT_FONT_FAMILY } }} />
                    <BleepsProvider
                        audioSettings={audioSettings}
                        playersSettings={playersSettings}
                        bleepsSettings={bleepsSettings}
                    >
                        {state.isStart &&
                            <AnimatorGeneralProvider animator={{ duration: { enter: 200, exit: 200 }}}>
                            {state.isLogin &&
                                <div className={styles.successModal}>
                                    <FrameBox>
                                        <div className={styles.frame}>
                                        <FrameLines>
                                            <Text className={styles.title}> [ Success LogIn ] </Text>
                                        </FrameLines>
                                        <div className={styles.ok}>
                                            <Button
                                                className={styles.btn}
                                                FrameComponent={FrameBox}
                                                onClick={() => setState({...state, isLogin: false, password: "", len: 0})}
                                            >
                                                <Text>Cancel</Text>
                                            </Button>
                                            <Button
                                                className={styles.btn}
                                                FrameComponent={FrameBox}
                                                onClick={()=>{
                                                    window.location.href = "/Access";
                                                }}
                                            >
                                                <Text>OK</Text>
                                            </Button>
                                        </div>
                                            </div>
                                    </FrameBox>
                                </div>
                            }
                            {!state.isLogin &&
                                <div className={styles.inputArea}>
                                <div className={styles.content}>
                                    <FrameLines>
                                    <input
                                        type={"text"}
                                        onInput={
                                            (e: any) => {
                                                checkPassword(e.target.value)
                                            }
                                        }
                                        value={
                                            [...Array(state.len)].map(_ => "*").join("")
                                        }
                                    />
                                    <div>
                                        <Button className={styles.btn} animator={{ activate: true }} onClick={() => checkPassword("7")}>
                                            <Text>7</Text>
                                        </Button>
                                        <Button className={styles.btn} onClick={() => checkPassword("8")}>
                                            <Text>8</Text>
                                        </Button>
                                        <Button className={styles.btn} onClick={() => checkPassword("9")}>
                                            <Text>9</Text>
                                        </Button>
                                    </div>
                                    <div>
                                        <Button className={styles.btn} onClick={() => checkPassword("4")}>
                                            <Text>4</Text>
                                        </Button>
                                        <Button className={styles.btn} onClick={() => checkPassword("5")}>
                                            <Text>5</Text>
                                        </Button>
                                        <Button className={styles.btn} onClick={() => checkPassword("6")}>
                                            <Text>6</Text>
                                        </Button>
                                    </div>
                                    <div>
                                        <Button className={styles.btn} onClick={() => checkPassword("1")}>
                                            <Text>1</Text>
                                        </Button>
                                        <Button className={styles.btn} onClick={() => checkPassword("2")}>
                                            <Text>2</Text>
                                        </Button>
                                        <Button className={styles.btn} onClick={() => checkPassword("3")}>
                                            <Text>3</Text>
                                        </Button>
                                    </div>
                                    <div>
                                        <Button className={styles.btn} onClick={() => checkPassword("0")}>
                                            <Text>0</Text>
                                        </Button>
                                        <Button className={styles.btn} onClick={() => setState({ ...state, password: "", isLogin: false, len: 0 })}>
                                            <Text>CLEAR</Text>
                                        </Button>
                                    </div>
                                </FrameLines>
                                </div>
                            </div>
                            }
                        </AnimatorGeneralProvider>
                        }

                    </BleepsProvider>
                </ArwesThemeProvider>
            </div>
        </Fragment>
    )

}
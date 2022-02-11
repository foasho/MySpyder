import React from "react";
import { ArwesThemeProvider, FrameLines, StylesBaseline, Figure, Text, Button } from "@arwes/core";
import { BleepSettings, BleepsProvider } from "@arwes/sounds";
import { AnimatorGeneralProvider } from "@arwes/animation";

const FONT_FAMILY_ROOT = '"Titillium Web", sans-serif';
const SOUND_ASSEMBLE_URL = '/assets/sounds/assemble.mp3';
const SOUND_TYPE_URL = '/assets/sounds/type.mp3';
const SOUND_CLICK_URL = '/assets/sounds/click.mp3';

const globalStyles = { body: { fontFamily: FONT_FAMILY_ROOT } };
const animatorGeneral = { duration: { enter: 200, exit: 200 } };
const audioSettings = { common: { volume: 0.25 } };
const playersSettings = {
  assemble: { src: [SOUND_ASSEMBLE_URL], loop: true },
  type: { src: [SOUND_TYPE_URL], loop: true },
  click: { src: [SOUND_CLICK_URL] }
};
const bleepsSettings = {
  assemble: { player: 'assemble' },
  type: { player: 'type' },
  click: { player: 'click' }
};

interface IInputProps {
    value: string;
    onChange?: (args: any) => void; 
}

export const InputComponent: React.FC<IInputProps> = (props) => {

    return (
        <ArwesThemeProvider>
            <BleepsProvider
                audioSettings={audioSettings}
                playersSettings={playersSettings}
                bleepsSettings={bleepsSettings}
            >
                <StylesBaseline />
                <AnimatorGeneralProvider animator={animatorGeneral}>
                    <FrameLines>
                        <input type={"text"} onInput={
                            (e: any) => {
                                if (props.onChange){
                                    props.onChange(e.target.value);
                                }
                            }
                        }/>
                    </FrameLines>
                </AnimatorGeneralProvider>
            </BleepsProvider>
        </ArwesThemeProvider>
    )
}
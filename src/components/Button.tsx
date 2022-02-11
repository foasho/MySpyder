import React from "react";
import { ArwesThemeProvider, StylesBaseline, Figure, Text, Button } from "@arwes/core";
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

interface IButtonProps {
    text: string;
}

export const ButtonComponent: React.FC<IButtonProps> = (props) => {

    const [state, setState] = React.useState({
        activate: true
    });

    React.useEffect(() => {
        const timeout = setTimeout(() => setState({activate: !state.activate}), 2000);
        return () => clearTimeout(timeout);
    }, [state.activate]);

    return (
        <ArwesThemeProvider>
            <StylesBaseline styles={globalStyles} />
            <BleepsProvider
                audioSettings={audioSettings}
                playersSettings={playersSettings}
                bleepsSettings={bleepsSettings}
            >
                <AnimatorGeneralProvider animator={animatorGeneral}>
                <Button
                    animator={{ activate: state.activate }}
                    onClick={event => console.log(event)}
                >
                    <Text>{props.text}</Text>
                </Button>
                </AnimatorGeneralProvider>
            </BleepsProvider>
            </ArwesThemeProvider>
    )
}
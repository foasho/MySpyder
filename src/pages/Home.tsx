import React, { Fragment } from "react";
import { ArwesThemeProvider, StylesBaseline, Figure } from "@arwes/core";
import { BleepSettings, BleepsProvider } from "@arwes/sounds";
import { ButtonComponent } from "../components/Button";

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

    return (
        <Fragment>
            <div>
                <ArwesThemeProvider>
                    <StylesBaseline styles={{ body: { fontFamily: ROOT_FONT_FAMILY } }} />
                    <BleepsProvider
                        audioSettings={audioSettings}
                        playersSettings={playersSettings}
                        bleepsSettings={bleepsSettings}
                    >
                        <div>
                            <ButtonComponent text={"test"}></ButtonComponent>
                        </div>
                        <Figure
                            src={IMAGE_URL}
                            alt='A nebula'
                            fluid
                        >
                        A nebula is an interstellar cloud of dust, hydrogen, helium and
                        other ionized gases.
                        </Figure>
                    </BleepsProvider>
                </ArwesThemeProvider>
            </div>
        </Fragment>
    )
}
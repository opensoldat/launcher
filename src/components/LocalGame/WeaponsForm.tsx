import React from "react";
import { observer } from "mobx-react"
import { WeaponsSettings } from "src/settings/server";

import Checkbox from "../Common/Checkbox";
import CheckboxLabelWithImage from "../Common/CheckboxLabelWithImage";
import SliderNumberInput from "../Common/SliderNumberInput";

import DesertEaglesImage from "assets/weapons/1.png";
import HKMP5Image from "assets/weapons/2.png";
import AK74Image from "assets/weapons/3.png";
import SteyrAUGImage from "assets/weapons/4.png";
import Spas12Image from "assets/weapons/5.png";
import Ruger77Image from "assets/weapons/6.png";
import M79Image from "assets/weapons/7.png";
import BarrettM82A1Image from "assets/weapons/8.png";
import FNMinimiImage from "assets/weapons/9.png";
import XM214MinigunImage from "assets/weapons/0.png";
import UssocomImage from "assets/weapons/10.png";
import KnifeImage from "assets/weapons/knife.png";
import ChainsawImage from "assets/weapons/chainsaw.png";
import M72LawImage from "assets/weapons/law.png";
import StationaryGunImage from "assets/weapons/m2.png";

type WeaponsFormProps = {
    weaponsSettings: WeaponsSettings;
}

const WeaponsForm: React.FC<WeaponsFormProps> = props => {
    const checkboxLabelsMinWidth = "10em";

    const renderCheckboxLabel = (labelText: string, imagePath: string): JSX.Element => {
        return (
            <CheckboxLabelWithImage
                label={labelText}
                labelMinWidth={checkboxLabelsMinWidth}
                imagePath={imagePath} />
        )
    }

    return (
        <div className="form">
            <div className="field">
                <label className="label"> Primary weapons </label>
                <div className="user-input checkboxes-list">
                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("Desert Eagles", DesertEaglesImage)} />

                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("HK MP5", HKMP5Image)} />

                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("AK-74", AK74Image)} />

                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("Steyr AUG", SteyrAUGImage)} />

                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("Spas-12", Spas12Image)} />

                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("Ruger 77", Ruger77Image)} />

                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("M79", M79Image)} />
                    
                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("Barrett M82A1", BarrettM82A1Image)} />

                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("FN Minimi", FNMinimiImage)} />

                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("XM214 Minigun", XM214MinigunImage)} />
                </div>
            </div>

            <div className="field">
                <label className="label"> Secondary weapons </label>
                <div className="user-input checkboxes-list">
                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("USSOCOM", UssocomImage)} />

                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("Combat Knife", KnifeImage)} />

                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("Chainsaw", ChainsawImage)} />

                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("M72 Law", M72LawImage)} />
                </div>
            </div>

            <div className="field">
                <label className="label"> Additional </label>
                <div className="user-input checkboxes-list">
                    <Checkbox
                        checked={false}
                        colorTheme="dark"
                        onToggle={null}
                        rightLabel={renderCheckboxLabel("Stationary guns", StationaryGunImage)} />
                </div>
            </div>

            <div className="field">
                <label className="label" htmlFor="max-grenades">
                    Maximum grenades
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        min={0}
                        max={6}
                        value={3}
                        onValueChange={null}
                        id="max-grenades" />
                </div>
            </div>
        </div>
    )
}

export default observer(WeaponsForm);
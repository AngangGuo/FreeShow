import { OutputBounds } from "./helpers/OutputBounds"
import { OutputIdentify } from "./helpers/OutputIdentify"
import { OutputSend } from "./helpers/OutputSend"
import { OutputValues } from "./helpers/OutputValues"
import { OutputVisibility } from "./helpers/OutputVisibility"
import { OutputLifecycle } from "./helpers/OutputLifecycle"
import { Message } from "../../types/Socket"
import { toApp } from ".."
import { CaptureTransmitter } from "./CaptureTransmitter"
import { updatePreviewResolution } from "./capture"
import { OUTPUT } from "../../types/Channels"
import { Output } from "./Output"

export class OutputHelper {
    static receiveOutput(_e: any, msg: Message) {
        const outputResponses: any = {
            CREATE: (data: any) => OutputHelper.Lifecycle.createOutput(data),
            REMOVE: (data: any) => OutputHelper.Lifecycle.removeOutput(data.id),
            DISPLAY: (data: any) => OutputHelper.Visibility.displayOutput(data),
            ALIGN_WITH_SCREEN: () => OutputHelper.Bounds.alignWithScreens(),

            MOVE: (data: any) => (OutputHelper.Bounds.moveEnabled = data.enabled),

            UPDATE_BOUNDS: (data: any) => OutputHelper.Bounds.updateBounds(data),
            SET_VALUE: (data: any) => OutputHelper.Values.updateValue(data),
            TO_FRONT: (data: any) => OutputHelper.Bounds.moveToFront(data),

            PREVIEW_RESOLUTION: (data: any) => updatePreviewResolution(data),
            REQUEST_PREVIEW: (data: any) => CaptureTransmitter.requestPreview(data),

            IDENTIFY_SCREENS: (data: any) => OutputHelper.Identify.identifyScreens(data),
        }

        if (msg.channel.includes("MAIN")) return toApp(OUTPUT, msg)
        if (outputResponses[msg.channel]) return outputResponses[msg.channel](msg.data)

        OutputHelper.Send.sendToOutputWindow(msg)
    }

    //static outputWindows: { [key: string]: BrowserWindow } = {}
    private static outputs: { [key: string]: Output } = {}

    static getOutput(id: string) {
        return this.outputs[id]
    }

    static getAllOutputs() {
        return Object.entries(this.outputs)
    }

    static setOutput(id: string, output: Output) {
        this.outputs[id] = output
    }

    static deleteOutput(id: string) {
        delete this.outputs[id]
    }

    static getKeys() {
        return Object.keys(OutputHelper.outputs)
    }

    static Bounds = OutputBounds
    static Identify = OutputIdentify
    static Lifecycle = OutputLifecycle
    static Send = OutputSend
    static Values = OutputValues
    static Visibility = OutputVisibility
}
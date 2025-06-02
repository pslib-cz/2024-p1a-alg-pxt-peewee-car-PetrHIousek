radio.setGroup(12)
radio.setFrequencyBand(39)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)

type drivingSignal = {
    x: number;
    y: number;
    z: number
};
type lightDirection = {
    c: DigitalPin;
    r: DigitalPin;
    l: DigitalPin
};
type data = {
    c: number;
    r: number;
    l: number
};

const IR: lightDirection = {
    c: DigitalPin.P15,
    r: DigitalPin.P13,
    l: DigitalPin.P14
};

let expectedSender = -1584843917;
let ready: boolean;
let y
let z
let x

radio.onReceivedString(function (received: string) {
    let sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    if (sender == expectedSender) {
        if (received === "stop") {
            ready = false
            basic.pause(60)
            PCAmotor.MotorStopAll()
            basic.showString("G", 0)
        } else ready = true
        if(ready) {
            basic.clearScreen()
            let parts = received.split(",")
            if (parts.length != 3) {
                return
            }
            x = parseInt(parts[0])
            y = parseInt(parts[1])
            z = parseInt(parts[2])  // zatím se nepoužívá

            // Výpočet základních rychlostí
            let leftSpeed = y / 4
            let rightSpeed = y / 4

            // Úprava pro zatáčení podle X
            if (x > 100) {
                leftSpeed += x / 10
                rightSpeed -= x / 2
            } else if (x < -100) {
                leftSpeed += x / 10
                rightSpeed -= x / 2
            }

            // Ovládání motorů PeeWee
            PCAmotor.MotorRun(PCAmotor.Motors.M1, -leftSpeed)
            PCAmotor.MotorRun(PCAmotor.Motors.M4, -rightSpeed)
        }
    }
})

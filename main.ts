radio.setGroup(12)
radio.setFrequencyBand(39)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)

let expectedSender = -1584843917;
let ready: boolean;


radio.onReceivedString(function (received: string) {
    let sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    if (sender == expectedSender) {
        if (received === "stop") {
            ready = false
            basic.pause(60)
            PCAmotor.MotorStopAll()
            basic.showString("G")
        } else ready = true
        if(ready) {
            basic.clearScreen()
            let parts = received.split(",")
            if (parts.length != 3) {
                return
            }
            let x = parseInt(parts[0])
            let y = parseInt(parts[1])
            let z = parseInt(parts[2])  // zatím se nepoužívá
            // Převrácení osy Y
            y = -y

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

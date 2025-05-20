radio.setGroup(12)
radio.setFrequencyBand(39)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)

let expectedSender = -1584843917
let sender;
let parts;
let x;

radio.onReceivedString(function (received: string) {
    sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    if (sender === expectedSender) {

        basic.clearScreen()

        parts = received.split(",")
        if (parts.length != 3) {
            return
        }

        let x = parseInt(parts[0])
        let y = parseInt(parts[1])
        let z = parseInt(parts[2]) // zatím nevyužito

        // Převrácení osy Y
        y = -y

        // Výpočet základních rychlostí
        let leftSpeed = y / 4
        let rightSpeed = y / 4

        // Úprava pro zatáčení podle X
        if (x > 100) {
            leftSpeed += x / 10
            rightSpeed -= x / 10
        } else if (x < -100) {
            leftSpeed -= x / 10
            rightSpeed += x / 10
        }

        // Omezit rychlosti na povolený rozsah
        leftSpeed = Math.constrain(leftSpeed, -255, 255)
        rightSpeed = Math.constrain(rightSpeed, -255, 255)

        // Ovládání motorů PeeWee
        PCAmotor.MotorRun(PCAmotor.Motors.M1, -2 * leftSpeed)
        PCAmotor.MotorRun(PCAmotor.Motors.M4, rightSpeed)
    }

})

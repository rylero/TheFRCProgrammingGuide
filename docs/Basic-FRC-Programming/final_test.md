# **Final Test**

1. The TalonFX is configured in the subsystem constructor with a kP and brake neutral mode.
2. One button uses position control to drive the motor to a position a few rotations away from 0. After the button is released, the motor still finishes the move and holds there.
3. A second button uses position control to drive the motor back to 0, and it holds there after that button is released.
4. A third button uses voltage control, through a ```VoltageOut``` request, to spin the motor at a few volts while the button is held. When the button is released, the motor stops. It does not stay at a position target during this.
5. ```periodic()``` logs measured position, measured velocity, and the position target.
6. AdvantageScope shows one run that includes both a position move and a voltage spin. During the position move the measured position meets the target without oscillating. During the voltage spin the shaft is turning and it stops when the button is released.

## **Bonus**
Press the voltage button while the motor is still driving to a position. On the graph, position control should let go and the motor should spin on voltage instead. Then press a position button again and it should go back to that target. Voltage and position are both ```setControl``` requests, so the one you send last is the one the Falcon follows.

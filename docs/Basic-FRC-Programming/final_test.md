# **Final Test**

1. The TalonFX is configured in the subsystem constructor with a kP and brake neutral mode.
2. One button drives the motor to a position a few rotations away from 0, and the motor holds there after the button is released.
3. A second button drives the motor back to 0, and the motor holds there after that button is released.
4. ```periodic()``` logs measured position, measured velocity, and the target.
5. AdvantageScope shows one run of both button presses. The target changes, and the measured position meets it without oscillating.

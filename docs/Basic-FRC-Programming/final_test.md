# **Final Test**

Do this on the test board with the ```MotorSubsystem``` you already have. You are finished when every requirement below is true.

## **Requirements**

- [ ] The TalonFX is configured in the subsystem constructor with a ```kP``` and brake neutral mode.
- [ ] One button drives the motor to a position a few rotations away from 0. The motor still goes there and holds after the button is released.
- [ ] A second button drives the motor back to 0 and holds there after that button is released.
- [ ] ```periodic()``` logs measured position, measured velocity, and the target.
- [ ] AdvantageScope shows one run with both button presses. The target changes, and the measured position meets it without oscillating.

If you get stuck, spend ~10-20min on the requirement that is failing before asking for help.

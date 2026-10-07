# **Final Test**

This uses the test-board `MotorSubsystem` and, for the last part, the team BasicSwerve repository. Reread the three lessons. Do not paste a finished answer from them.

## **Motion Magic**

1. Add a `MotionMagicVoltage` command that goes to a position a few rotations away and finishes on its own when the measured position is inside a tolerance.
2. Set `MotionMagicCruiseVelocity` and `MotionMagicAcceleration` in a `TalonFXConfiguration` and apply it.
3. Tune in the lesson order: kS, then kV, then kA, then kP, then kD only if it overshoots. Leave kI at 0.
4. Graph target position, measured position, and measured velocity in AdvantageScope. The velocity trace should show the trapezoid, or a triangle if the move is short, and the position should settle on the target.

Write down the gains you kept. Also write down one change that made the move worse, and what the graph did.

## **Velocity**

1. Add a `VelocityVoltage` command on a **different slot** from Motion Magic.
2. Tune kS, then kV, then kP, with kP still at 0 while you tune kV.
3. Bind it with `whileTrue`. Releasing the button must stop the motor.
4. The velocity graph should sit on the target while the button is held and drop to 0 when it is released.

## **A Group**

Bind one button to a sequence that goes to the Motion Magic target, waits about a second, and comes back to 0. The first move has to finish before the wait starts. Requiring the subsystem twice in parallel does not count. That cancels one of the commands.

## **BasicSwerve**

At the shop, run the Tuner X generator through encoder calibration and both validation tests, generate `TunerConstants`, and import that file into BasicSwerve without replacing the team's simulation or `RobotContainer`.

Away from the shop, clone BasicSwerve and drive the drivetrain in the simulation that is already in the repo. You are done with this part when that simulation drives, or when the imported constants deploy and the real modules steer and drive in the direction you validated.

If BasicSwerve does not have simulation yet, say so. Building that simulation is not part of this test. It is something the repo has to grow before students can practice the drivetrain outside the shop.

## **Done When**

* One button runs the out-and-back Motion Magic sequence, and the graph matches the move.
* Another button holds a velocity and stops on release, on its own gain slot.
* BasicSwerve either simulates that drivetrain or runs it on the robot with the constants you imported.

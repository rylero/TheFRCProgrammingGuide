# **CTRE Swerve and BasicSwerve**

The test board is one Falcon. A swerve drivetrain is eight TalonFX controllers, four CANcoders, and a Pigeon 2, with a steer motor and a drive motor on each corner. You do not hand-write that project. Phoenix Tuner X has a Swerve Project Generator that checks the modules and writes the drivetrain code.

That generated project is not the team codebase. After Tuner X finishes, the generated constants and drivetrain are imported into **BasicSwerve**, the team repository. BasicSwerve is the project you clone, edit, and run.

The generator steps below follow the [CTRE Swerve Project Generator](https://v6.docs.ctr-electronics.com/en/stable/docs/tuner/tuner-swerve/index.html). Use that manual if a screen does not match this page. Tuner X changes layout between seasons.

## **Before You Open the Generator**

Tuner X has to see the real drivetrain. This part happens at the shop, with the robot on.

* Eight TalonFX (or TalonFXS) devices, four encoders (CANcoder, CANdi, or a TalonFXS with a PWM encoder), and one Pigeon 2
* Every device shows up in Tuner X, on the same CAN bus
* Firmware is current for the season, and the current year's diagnostic server is running
* Name the devices in Tuner before you start, such as `FL Steer` and `FL Drive`. The generator is painful to debug when every device is still called TalonFX

Pro licensing and a CANivore are recommended. They are not required to generate the project.

## **Create the Tuner Project**

In Tuner X, open the Mechanisms page and start the Swerve Project Generator.

1. Set the wheel radius, in inches. Measure the wheel width and divide by two.
2. Set the track width and the wheelbase, from the center of one module to the center of the opposite module.
3. Pick the module type. Swerve X, an SDS module, and anything else the list names are there. If the module is not listed, choose Custom and enter the drive ratio and the steer ratio yourself.
4. Click **New Project**.

Use **Export** in the top right when the project is set up, and keep that file. Regenerating from memory is how offsets get lost.

## **Configure Each Module**

For each corner, in the module dropdown:

1. Select the encoder.
2. Select the steer motor.
3. Select the drive motor.
4. Run **Encoder Calibration**. Point the wheel the way the calibration popup asks, then let it record the CANcoder offset.

Do all four modules. If you move an encoder to a different corner, calibrate that module again. When the last module is done, click **Configuration Completed**.

The generator factory-defaults devices so the steer and drive tests mean something. Robot code should be what applies configs at runtime. If you had hand-tuned configs only inside Tuner, back them up first.

## **Validate**

**Verify Steer.** The test rotates every module. Looking down at the modules, they should turn counter-clockwise. If they do not, the steer invert is wrong. Fix it in the generator. Do not patch it later in Java.

**Verify Drive.** Modules go to their zero heading, then the drive motors run at a small duty cycle. Decide whether the robot would have moved forward or backward. Forward on the left side is counter-clockwise when you look from outside the robot. If a wheel is sideways, the CANcoder offset is wrong. Go back, point the bevel the way the calibration step required, and calibrate again.

Do not generate until both tests pass. A generated project remembers a bad offset faithfully.

## **Generate, then Import into BasicSwerve**

**Generate Project** asks for the team number and for Java. That writes a full robot program, including `TunerConstants` and the drivetrain subsystem. **Generate only TunerConstants** rewrites the constants file for a project that already has the drivetrain class. Use that button when BasicSwerve is already there and only the measurements or offsets changed.

Import means copying the generated swerve code into BasicSwerve. It does not mean replacing BasicSwerve with the generated project.

1. Clone the team BasicSwerve repository and open it in WPILib VS Code.
2. From the generated project, copy `src/main/java/frc/robot/generated/TunerConstants.java` into the same path in BasicSwerve. Replace the file that is there.
3. If BasicSwerve's drivetrain class is still the stock generated `CommandSwerveDrivetrain`, copy that file over too. If the team class has been edited, keep the team class and only update `TunerConstants`.
4. Leave BasicSwerve's `RobotContainer`, simulation, and logging alone. Those are the reason this repo exists. The generated `RobotContainer` is a demo, not the team robot.

Commit the imported files on a branch. The next person should be able to see that the constants changed and the rest of the repo did not.

!!! note "Running it outside the shop"

    Setting up swerve simulation is a project of its own, and this section does not teach it. BasicSwerve is expected to already contain a working simulation so you can drive the drivetrain without the robot in the room. After the import, run that simulation from the repo's instructions. In a normal WPILib project that is the command palette, `WPILib: Simulate`.

    If simulation is not in the repo yet, it has to be added to BasicSwerve once, for the whole team. Do not build a second simulation inside a personal copy of the generated project.

At the shop, deploy BasicSwerve to the robot after the imported constants match the modules you just validated. The same project is what you simulate at home and what you deploy on the real drivetrain.

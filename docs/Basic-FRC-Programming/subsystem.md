# **What is a Subsystem**

In the last project we made `MotorSubsystem` and spun the Falcon. Now lets actually look at what that class is doing.

A subsystem is the code for one mechanism. It holds the motors and sensors for that mechanism, and the rest of the robot asks the subsystem when it wants something to move. The test board is one mechanism, so one subsystem is enough. A real robot is the same idea split up: drivetrain, intake, elevator, each in its own class.

<figure markdown="span">
    ![Programming Test Board](../img/test_board.webp){ width="600" }
  <figcaption>The test board is one mechanism, so it gets one subsystem</figcaption>
</figure>

## **Open the Class**
Open the search palette with ++ctrl+p++ and type ```MotorSubsystem.java```. You should already have something like this from the last project:

```java
public class MotorSubsystem extends SubsystemBase {
    private TalonFX motor;

    public MotorSubsystem() {
        motor = new TalonFX(10);
    }
}
```

```extends SubsystemBase``` is what tells WPILib this class is a subsystem. That gives us ```periodic()```, and the command helpers like ```runOnce()```, which we will use in the next lesson.

The constructor runs once, when ```RobotContainer``` does ```new MotorSubsystem()```. ```new TalonFX(10)``` is the Falcon on CAN id 10. If that number is wrong, the code still deploys. The motor just will not be the one you think it is.

```private``` means other files cannot do ```motor.setVoltage()``` themselves. They have to call a method on the subsystem. That sounds annoying until two different commands both try to spin the same motor.

## **What Goes in Here**
Put the hardware for this mechanism in the subsystem. Put methods that talk to that hardware in the subsystem. Button logic does not go here. Buttons live in ```RobotContainer```.

```periodic()``` is a method the scheduler calls for us about every 20ms. We will use it later to log position and velocity. For now, add an empty one so you can see where it goes:

```java
@Override
public void periodic() {
}
```

## **One Command at a Time**
Only one command is allowed to use a subsystem at a time. If a new command needs ```MotorSubsystem``` while another one already has it, the scheduler stops the old command and starts the new one. You do not write that stop yourself. Requiring the subsystem is enough, and the command helpers do that for you.

## **Challenges**
Try these on the test board before you move on. If you get stuck, spend ~10-20min on your own before asking for help.

Easier:

1. Put ```System.out.println("subsystem created");``` inside the constructor. Deploy, open the Riolog (the driver station console, or the WPILib RioLog in VS Code), and find that line. Then delete the print. Prints in a constructor run once. That is the point.

2. Change the CAN id from 10 to 11, deploy, and try to spin the motor with the code from the last project. It should do nothing useful. Put it back to 10.

Medium:

1. Add a counter in ```periodic()``` and print it every time it is a multiple of 50. Deploy and watch the console. You should see a new number about once a second, because ```periodic()``` is running about 50 times a second. Take the print out when you are done so the log is not full of numbers.

2. In ```RobotContainer```, try to write ```motorSubsystem.motor.setVoltage(3);```. It should not compile, because ```motor``` is private. That is what we want. The next lesson is how the rest of the code is supposed to ask the subsystem to move.

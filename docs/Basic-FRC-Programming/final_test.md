# **Final Test**

This is on the test board, in the ```MotorSubsystem``` you have been editing. Go back and reread whatever you need. Try not to paste a finished command straight off the earlier pages. The point is to build it again from the pieces.

If you get stuck, spend ~10-20min on the step you are on before asking for help.

## **Challenges**
Do them in order. Each one should still be on the robot when you start the next, so by the end you have all of it at once.

Easier:

1. In the constructor, apply a ```TalonFXConfiguration``` with ```Slot0.kP``` set and neutral mode set to brake. Deploy. If it does not compile, the imports are the usual reason.

2. Add a command that holds a position with ```PositionVoltage```, and keep calling ```setControl``` while it runs. Bind one button to a target a few rotations away, and another button back to 0. Enable and run both.

Medium:

1. Log measured position, measured velocity, and the target from ```periodic()```. Open AdvantageScope, connect, and put position and target on one graph. Run the move. The target should step, and the position should go meet it.

2. Find a kP that holds without buzzing, and try one that is obviously too high and one that is obviously too low. Leave the good one in the code. Put the bad ones in a comment so you remember what they did.

Hard:

1. Make the "go to position" command finish by itself when it is close, and bind it with ```onTrue```. Letting go of the button early should not cancel the move. The "go back to 0" button should still be able to interrupt it, because both commands need the subsystem.

2. Show someone the graph of one clean move and one bad kP. You should be able to point at the lines and say what the motor did, not just that "it worked."

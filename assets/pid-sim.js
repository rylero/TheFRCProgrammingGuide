// PID Controller and Plant Simulation (Embedded for MkDocs)
class PIDSimulator {
    constructor() {
        this.dt = 0.1; // Time step (s)
        this.maxTime = 300;
        this.numSteps = Math.floor(this.maxTime / this.dt);
        
        // Plant state (second-order: position/pose, velocity)
        this.delaySteps = 10; // ~1s delay
        
        // PID state
        this.integral = 0;
        this.prevError = 0;
        
        // Parameters (scaled down ranges)
        this.kp = 0;
        this.ki = 0;
        this.kd = 0.0;
        
        // Plant parameters (tuned for generic second-order with damping)
        this.spring = 0.1; // Restoring force
        this.damping = 0.5; // Velocity damping
        
        // Chart setup
        this.ctx = document.getElementById('pidChart').getContext('2d');
        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Setpoint',
                        data: [],
                        borderColor: '#4B90E2',
                        backgroundColor: 'rgba(75, 144, 226, 0.1)',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0,
                        pointRadius: 0
                    },
                    {
                        label: 'Current Pose',
                        data: [],
                        borderColor: '#E91E63',
                        backgroundColor: 'rgba(233, 30, 99, 0.1)',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Output',
                        data: [],
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true, pointStyle: 'rect' }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Time (s)' },
                        min: 0,
                        max: this.maxTime,
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        title: { display: true, text: 'Normalized Value' },
                        min: -1,
                        max: 3.0, // Allow room for output peaks
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                },
                animation: {
                    duration: 500 // Smooth transition on updates
                }
            }
        });
        
        this.initEventListeners();
        this.computeFullSimulation();
        this.chart.update();
    }
    
    initEventListeners() {
        const sliders = {
            kp: document.getElementById('kp'),
            ki: document.getElementById('ki'),
            kd: document.getElementById('kd')
        };
        
        const updateAndCompute = (e) => {
            // Update parameter
            if (e.target.id === 'kp') {
                this.kp = parseFloat(e.target.value);
                document.getElementById('kpValue').textContent = this.kp.toFixed(2);
            } else if (e.target.id === 'ki') {
                this.ki = parseFloat(e.target.value);
                document.getElementById('kiValue').textContent = this.ki.toFixed(3);
            } else if (e.target.id === 'kd') {
                this.kd = parseFloat(e.target.value);
                document.getElementById('kdValue').textContent = this.kd.toFixed(2);
            }
            
            // Recompute full simulation
            this.computeFullSimulation();
            this.chart.update();
        };
        
        sliders.kp.addEventListener('input', updateAndCompute);
        sliders.ki.addEventListener('input', updateAndCompute);
        sliders.kd.addEventListener('input', updateAndCompute);
    }
    
    computePID(setpoint, pose) {
        const error = setpoint - pose;
        this.integral += error * this.dt;
        const derivative = (error - this.prevError) / this.dt;
        const output = this.kp * error + this.ki * this.integral + this.kd * derivative;
        this.prevError = error;
        return output; // No clamping - allow peaks
    }
    
    updatePlant(uDelayed, vel, pose) {
        // Second-order dynamics: acc = input - damping*vel - spring*pose
        const acc = uDelayed - this.damping * vel - this.spring * pose;
        const newVel = vel + acc * this.dt;
        const newPose = pose + newVel * this.dt;
        return { newPose, newVel };
    }
    
    computeFullSimulation() {
        // Reset states
        let pose = 0;
        let vel = 0;
        let delayBuffer = new Array(this.delaySteps).fill(0);
        this.integral = 0;
        this.prevError = 0;
        
        // Pre-allocate arrays
        const labels = [];
        const setpoints = [];
        const poses = [];
        const outputs = [];
        
        // Simulate all steps
        for (let i = 0; i < this.numSteps; i++) {
            const time = i * this.dt;
            const setpoint = time > 0 ? 1.0 : 0; // Step at t=0
            
            // PID computation
            const u = this.computePID(setpoint, pose);
            
            // Delay: shift buffer, add new u
            delayBuffer.shift();
            delayBuffer.push(u);
            const uDelayed = delayBuffer[0]; // Use oldest for delay
            
            // Update plant
            const { newPose, newVel } = this.updatePlant(uDelayed, vel, pose);
            pose = newPose;
            vel = newVel;
            
            // Collect data
            labels.push(time.toFixed(1));
            setpoints.push(setpoint);
            poses.push(pose);
            outputs.push(u);
        }
        
        // Update chart data
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = setpoints;
        this.chart.data.datasets[1].data = poses;
        this.chart.data.datasets[2].data = outputs;
    }
}

// Initialize simulator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PIDSimulator();
});
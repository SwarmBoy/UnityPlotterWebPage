PORTTCP=5000
PORTHTTP=9051
PORTWEBSITE=3000

# Function to kill process on a specific port using PowerShell
kill_process_on_port() {
    PORT=$1
    PID=$(powershell.exe -Command "(Get-NetTCPConnection -LocalPort $PORT -State Listen).OwningProcess" | tr -d '\r')
    if [ -n "$PID" ]; then
        echo "Killing process on port $PORT (PID: $PID)"
        powershell.exe -Command "Stop-Process -Id $PID -Force"
    else
        echo "No process running on port $PORT"
    fi
}

check_process_on_port() {
    PORT=$1
    PID=$(powershell.exe -Command "(Get-NetTCPConnection -LocalPort $PORT -State Listen).OwningProcess" | tr -d '\r')
    
    if [ -n "$PID" ]; then
        echo "There is a process on port $PORT (PID: $PID)"
        return 0
    else
        echo "No process running on port $PORT"
        return 1
    fi
}


# Check and kill processes for the defined ports
kill_process_on_port $PORTTCP
kill_process_on_port $PORTHTTP


# Start the Python scripts in Windows using PowerShell
powershell.exe -Command "Start-Process cmd -ArgumentList '/C python3 C:\Users\Pablo\Documents\MIT\UnityMIT\WebPages\unity-plotter\TCPserver.py'"
powershell.exe -Command "Start-Process cmd -ArgumentList '/C python3 C:\Users\Pablo\Documents\MIT\UnityMIT\WebPages\unity-plotter\httpServer.py'"


# Check if the website is running
check_process_on_port $PORTWEBSITE
if [ $? -eq 0 ]; then
    echo "Website is running. No need to start it."
else
    echo "Website is not running. Starting it in WSL..."
    #create a new terminal window and start the website but in WSL

    npm start

fi

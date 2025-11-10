// Node.js script to kill process on a specific port
const { exec } = require('child_process');
const readline = require('readline');

const port = process.argv[2] || 5000;

console.log(`🔍 Checking for processes on port ${port}...`);

// Windows command to find process using port
const findProcessCmd = `netstat -ano | findstr :${port} | findstr LISTENING`;

exec(findProcessCmd, (error, stdout, stderr) => {
  if (error) {
    console.log(`✅ No process found using port ${port}`);
    process.exit(0);
  }

  // Extract PID from output
  const lines = stdout.trim().split('\n');
  const pids = new Set();
  
  lines.forEach(line => {
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && !isNaN(pid)) {
      pids.add(pid);
    }
  });

  if (pids.size === 0) {
    console.log(`✅ No process found using port ${port}`);
    process.exit(0);
  }

  console.log(`\n📋 Found ${pids.size} process(es) using port ${port}:`);
  pids.forEach(pid => console.log(`   PID: ${pid}`));

  // Ask for confirmation
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(`\n⚠️  Kill these processes? (y/N): `, (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log(`\n🔄 Terminating processes...`);
      
      let killed = 0;
      pids.forEach(pid => {
        exec(`taskkill /PID ${pid} /F`, (err) => {
          if (err) {
            console.error(`❌ Failed to kill process ${pid}:`, err.message);
          } else {
            console.log(`✅ Process ${pid} terminated`);
            killed++;
          }

          if (killed === pids.size) {
            console.log(`\n✅ Done! Port ${port} should now be free.`);
            rl.close();
            process.exit(0);
          }
        });
      });
    } else {
      console.log('❌ Cancelled.');
      rl.close();
      process.exit(0);
    }
  });
});


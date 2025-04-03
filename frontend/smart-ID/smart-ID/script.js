// Login Form Simulation
document.getElementById('login-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    // Simulate a login (here you would validate credentials)
    window.location.href = 'dashboard.html';
  });
  
  // Simulate RFID scan for Attendance Page
  function simulateRFIDScan() {
    document.getElementById('rfid-status').innerText = 'Status: RFID Scanned, Attendance Marked!';
    alert('RFID scanned successfully!');
  }
  
  // Calculate library fine based on due date (if overdue)
  document.addEventListener('DOMContentLoaded', function () {
    const fineElement = document.getElementById('fine-calc');
    if (fineElement) {
      // Assume due date is fixed for demonstration (04/10/2025)
      const dueDate = new Date('2025-04-10');
      const today = new Date();
      let fine = 0;
      if (today > dueDate) {
        const daysLate = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
        fine = daysLate * 5; // Example fine rate: 5 PKR per day
      }
      fineElement.innerText = fine ? `${fine} PKR` : 'No Fine';
    }
  });
  
  // Recharge functionality for Account Balance Page
  function recharge() {
    const amountInput = document.getElementById('recharge-amount');
    let amount = parseInt(amountInput.value);
    let balanceDisplay = document.getElementById('balance-display');
    let currentBalance = parseInt(balanceDisplay.innerText.split(' ')[0]);
    if (!isNaN(amount) && amount > 0) {
      currentBalance += amount;
      balanceDisplay.innerText = currentBalance + ' PKR';
      alert('Recharge Successful! New Balance: ' + currentBalance + ' PKR');
    } else {
      alert('Please enter a valid amount');
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    const switchInput = document.getElementById("switch");
    const userTypeLabel = document.getElementById("user-type-label");

    switchInput.addEventListener("change", function () {
        userTypeLabel.textContent = this.checked ? "Teacher" : "Student";
    });

    document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Login Successful!");
    });
});

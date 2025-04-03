const header = { "Content-Type": "application/json"}

document.addEventListener('DOMContentLoaded', async () => {
    let payload = {buyer_id: sessionStorage.getItem('user_id')}
    const transactionHistory = await fetch("http://localhost:3000/transactionHistory", {
        method : "POST",
        headers: header,
        body: JSON.stringify(payload)
    }).then(response => response.json())

    payload = {_id: sessionStorage.getItem('user_id')}
    const userInfo = await fetch("http://localhost:3000/person", {
        method : "POST",
        headers: header,
        body: JSON.stringify(payload)
    }).then(response => response.json())

    const balanceHeader = document.getElementById('balance');
    const transactionHistoryTable = document.getElementById('transactionHistoryTable');
    balanceHeader.innerHTML = "<h3>Current Balance: <span>"+userInfo['balance']+" Rs</span></h3>";
    balanceHeader.style.color = 'green';

    for (let i = 0; i < transactionHistory.length; i++) {
        let newRow = transactionHistoryTable.insertRow();
        let slNumCell = newRow.insertCell(0);
        let itemCell = newRow.insertCell(1);
        let dateCell = newRow.insertCell(2);
        let timeCell = newRow.insertCell(3);
        let amountCell = newRow.insertCell(4);

        slNumCell.innerHTML = i + 1 + '.';
        itemCell.innerHTML = transactionHistory[i]['item_name'];
        dateCell.innerHTML = transactionHistory[i]['buy_date'];
        timeCell.innerHTML = transactionHistory[i]['buy_time'];
        if (transactionHistory[i]['type'] == 'loss'){
            amountCell.innerHTML = '-' + transactionHistory[i]['item_price']
            amountCell.style.color = "red"
        } else {
            amountCell.innerHTML = '+' + transactionHistory[i]['item_price']
            amountCell.style.color = "green"
        }
        
    }
})
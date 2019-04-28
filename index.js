const baseUrl = 'http://localhost:3000'

const protocols = {
    AI_BE : 'aibe',
    AI_BX : 'aibx',
    AI_BO : 'aibo',
    AI_BW : 'aibw'
}

const startPreviewer = () => {
    console.log('Page Loaded')
    loadTransactions('aibe')
    loadTransactions('aibx')
    loadTransactions('aibw')
}  

function getPath(protocol){
    let path
    switch(protocol){
        case protocols.AI_BE : 
            path = '/aibe'
            break

        case protocols.AI_BX :
            path = '/aibx'
            break

        case protocols.AI_BO :
            path = '/aibo' 
            break

        case protocols.AI_BW :
            path = '/aibw'
            break

    }
    return path
}

async function loadTransactions(protocol){

    fetch(`${baseUrl}${getPath(protocol)}`).then(response => {
        if(response.ok) return response.json()
    }).then(response =>{
        createTable(response, protocol)
    }) 
}

async function approve(address, amount, protocol){

    fetch(`${baseUrl}/airdrop`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      
        //make sure to serialize your JSON body
        body: JSON.stringify({
          address : address,
          amount : amount,
          protocol : protocol
        })
      })
      .then( (response) => { 
         //do something awesome that makes the world a better place
         alert(response.status)
      });
}



const createTable = (transactions, protocol) => {

    let tblBox
   
    switch(protocol){
        case protocols.AI_BE : 
            tblBox = document.getElementById('ethereum_box')
            break

        case protocols.AI_BX :
            tblBox = document.getElementById('stellar_box')
            break
        case protocols.AI_BO :
            tblBox = document.getElementById('eos_box')
            break
        case protocols.AI_BW :
            tblBox = document.getElementById('waves_box')
            break
    }


    tblBox.innerHTML = ""

      if(transactions !== null && transactions.length > 0){
        let tblContainer = document.createElement('div')
        tblContainer.className = 'table-container'

        let table = document.createElement('table')
        table.className = 'table is-fullwidth'
        table.id = 'transactionTable'

        let thead = document.createElement('thead')
        let tr = document.createElement('tr')

        let thId = document.createElement('th')
        thId.textContent = 'Id'

        let thAddress = document.createElement('th')
        thAddress.textContent = 'Address'

        let thAmount = document.createElement('th')
        thAmount.textContent = 'Amount'

        let thStatus = document.createElement('th')
        thStatus.textContent = 'Status'

        let thAction = document.createElement('th')
        thAction.textContent = 'Action'


        tr.appendChild(thId)
        tr.appendChild(thAddress)
        tr.appendChild(thAmount)
        tr.appendChild(thStatus)
        tr.appendChild(thAction)
        thead.appendChild(tr)

        table.appendChild(thead)

        transactions.forEach(element => {
            
          let tbody = document.createElement('tbody')
          let tdId = document.createElement('td')
          let tdAddress = document.createElement('td')
          let tdAmount = document.createElement('td')
          let tdStatus = document.createElement('td')
          let tdAction = document.createElement('td')

        tdId.textContent = element.id
        tdAddress.textContent = element.address.substring(0,16) + '...'
        tdAmount.textContent = element.amount
       
        
        if(!element.received){
            let btnApprove = document.createElement("a")
            btnApprove.className = 'button is-primary is-outlined'
            btnApprove.innerHTML = 'Approve'

            let btnReject = document.createElement("a")
            btnReject.className = 'button is-danger is-outlined'
            btnReject.innerHTML = 'Reject'
     
            tdAction.appendChild(btnApprove)
            tdAction.appendChild(btnReject)
           
            btnApprove.onclick = function(){
                approve(element.address, element.amount, protocol)
                return false
            }
            
            tdStatus.textContent = 'Pending'
        }else{
            tdStatus.textContent = 'Completed'
        }
        

        tbody.appendChild(tdId)
        tbody.appendChild(tdAddress)
        tbody.appendChild(tdAmount)
        tbody.appendChild(tdStatus)
        tbody.appendChild(tdAction)

        
          table.appendChild(tbody)
   
      });
  
      tblContainer.appendChild(table)
      tblBox.appendChild(tblContainer)
      
    }
  }

  window.addEventListener('load', startPreviewer())
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
// select all of these

Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)  // add deleted items to an event listener 
})

Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete)  // add all items to an event listener
})

Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)  // add completed items to an event listener
})

async function deleteItem() {  // deleting things!
    const itemText = this.parentNode.childNodes[1].innerText  // direct reference - grab parent, then child, second one, then text - don't do this! use classes! AAAUGH!
    try {
        const response = await fetch('deleteItem', {  // this happens back
            method: 'delete',  // method called "delete"
            headers: { 'Content-Type': 'application/json' },  // makes it JSON
            body: JSON.stringify({  // makes it a string
                'itemFromJS': itemText  // this ties to server.js "delete" (line 83ish)
            })
        })
        const data = await response.json()  // waited. now time to read.
        console.log(data)  // baby got back
        location.reload()  // refresh the page

    } catch (err) {  // ruh roh.
        console.log(err)  // log what failed
    }
}

async function markComplete() {  // make it complete
    const itemText = this.parentNode.childNodes[1].innerText  // see above for notes. they match up from the deleteItem function.
    try {
        const response = await fetch('markComplete', {  // wait for this to happen
            method: 'put',  // method called "put"
            headers: { 'Content-Type': 'application/json' },  // make sure it's JSON
            body: JSON.stringify({  // make it a string
                'itemFromJS': itemText  // link us to server.js
            })
        })
        const data = await response.json()  // wait is over. time to read.
        console.log(data)  // log the data
        location.reload()  // refresh

    } catch (err) {  // error
        console.log(err)  // this is the error
    }
}

async function markUnComplete() {  // make it not complete
    const itemText = this.parentNode.childNodes[1].innerText// see above above
    try {
        const response = await fetch('markUnComplete', {  // wait for this to happen
            method: 'put',  // put method again
            headers: { 'Content-Type': 'application/json' },  // make sure it's JSON
            body: JSON.stringify({  // make it a string
                'itemFromJS': itemText  // link us to server.js
            })
        })
        const data = await response.json()  // wait is over. time to read.
        console.log(data)  // log the data
        location.reload()  // refresh

    } catch (err) {  // error
        console.log(err)  // explanation of error
    }
}
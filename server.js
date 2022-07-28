const express = require('express') // Requires express package that we installed.
const app = express() // Initializing the package so we can use it
const MongoClient = require('mongodb').MongoClient // Requiring the MongoDB and client in a variable so we can access it
const PORT = 2121 // PORT runs here (which is compatible with heroku)
require('dotenv').config() // holds secret thingies like variable keys (need to put them in heroku as variables)


let db, // shorten up variables so less typing (empty)
    dbConnectionStr = process.env.DB_STRING, // look here for environmental variable connection string
    dbName = 'todo' // variable assignment

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Connect to the database using string above
    .then(client => { // after connecting then do: (function)
        console.log(`Connected to ${dbName} Database`) // let us know we connected correctly
        db = client.db(dbName) // assign the db variable from line 8
    })

app.set('view engine', 'ejs') // set the options for the express app we assigned earlier
app.use(express.static('public')) // middleware - look in the public folder for routes we call up later; comes between the request and response
app.use(express.urlencoded({ extended: true })) // settings
app.use(express.json()) // more settings


app.get('/', async (request, response) => { // client requests the 'route' page -> we send back these or errors
    const todoItems = await db.collection('todos').find().toArray() // wait for the database to reply; convert the documents from database into an array
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) // wait for the database to reply; grab the specific documents that have a false status
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // show us the goods
    // db.collection('todos').find().toArray() -> find the todos, put in array; only one connection here then filter them
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false}) -> find the number of completed
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) -> if we hit an error let us know (second half of the try/catch)
})

app.post('/addTodo', (request, response) => { // update from the CRUD or create
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) // add a new item to our todo list on database; insert in the body of the todoItem and automatically set it to false for completed
        .then(result => { //
            console.log('Todo Added') // let us know that we successfully added a todo
            response.redirect('/') // go back to the route screen
        })
        .catch(error => console.error(error)) // if error, show error in console log
})

app.put('/markComplete', (request, response) => { // update some parts of the documents on our database
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // change the todo
        $set: {
            completed: true // mark it as complete
        }
    }, {
        sort: { _id: -1 },  // sort by id: descending biggest to smallest so it ends up last
        upsert: false  // update + insert = upsert; updates the rendering so you don't double add stuff
    })
        .then(result => {  // second do:
            console.log('Marked Complete')  // let us know it worked
            response.json('Marked Complete')  // let the client know it worked
        })
        .catch(error => console.error(error))  // if error, show error in console log

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: false
        }
    }, {
        sort: { _id: -1 },  // sort by id: this guy goes last
        upsert: false  // don't add a double
    })
        .then(result => {  // sets up result in case we want to use it later, but don't use it now
            // Prev 'Marked Complete' was likely typo. Changed to 'Marked Incomplete'
            console.log('Marked Incomplete')  // let us know it worked
            response.json('Marked Incomplete')  // let the client know it worked
        })
        .catch(error => console.error(error))  // if error, show error in console log

})

app.delete('/deleteItem', (request, response) => {  // delete an item
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })  // DELETED
        .then(result => {  // take result in case we want it later
            console.log('Todo Deleted')  // it worked - to server
            response.json('Todo Deleted')  // it worked - to client
        })
        .catch(error => console.error(error))  // if error, show error in console log
})

app.listen(process.env.PORT || PORT, () => {  // this is where we listen to the PORT; first one is for heroku's set one or else use the one we declared
    console.log(`Server running on port ${PORT}`)  // server lets us know we are connected
})
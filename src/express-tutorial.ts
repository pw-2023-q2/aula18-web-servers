/***
 * Demonstration of Express routes and middleware
 */
import e from "express"
import * as path from "path"

const app = e()

const STATIC_DIR = path.join(__dirname, '..', 'static')
const IMG_DIR = path.join(STATIC_DIR, 'img')

/**
 * Dynamic route 1
 */
 app.get('/hello', (req, res) => res.send('Hello World!'))

 /**
  * Dynamic route 2
  */
 app.get('/goodbye', (req, res) => res.send('Goodbye World!'))
 
 /**
  * Dynamic route with different status code
  */
 app.get("/internal-error", (req, res) => 
    res.status(500).send("Internal server error")) 
 
 // NOTE: implement default route before proceeding


/**
 * Using a middleware
 */
app.use('/static', e.static(STATIC_DIR))

/**
 * Route which accepts all HTTP methods
 * Additionally, it starts a chain
 */
app.all("/", (req, res, next) => {
    res.write("<p>You made any HTTP request</p>")
    next()
})

/**
 * Route that accepts GET method
 * Additionally, it ends a chain
 */
app.get("/", (req, res) => {
    res.write("<p>You made a GET request</p>")
    res.end()
})

/**
 * Route that accepts a POST method
 * Additionally, it ends a chain
 */
app.post("/", (req, res) => {
    res.write("<p>You made a POST request</p>")
    res.end()
})

/**
 * Route with string pattern matching
 * Will match: /userdetails, /userrrrrrrDetails, etc.
 */
app.get("/user+details", (req, res) => res.send(req.originalUrl))

/**
 * Route with regular expression pattern matching
 * Will match any path that contains ufabc
 */
app.get(/ufabc/, (req, res) => res.send(req.originalUrl))

/**
 * Middleware that parses a query string
 */
app.get('/query', (req, res) => res.json(req.query))

/**
 * Middleware that renders data extracted from the query string
 */
app.get('/hello', (req, res) => {
    if (req.query && "fname" in req.query && "lname" in req.query) {
        res.send(`<p>Hello, ${req.query.fname} ${req.query.lname}!</p>`)
    }
    res.send("Usage: /hello/<first-name>/<last-name>")        
})

// middleware to parse request bodies (only parse those which are url-encoded)


/**
 * Middleware that process form data
 */
declare global {
    namespace Express {
        export interface Request {
            data?: any
        }
    }
}

app.get("/process2", (req, res, next) => {
    req.data = req.query
    next()
})

app.post("/process2", e.urlencoded({extended: true}), (req, res, next) => {
    req.data = req.body
    next()
})

app.all("/process2", (req, res) => {
    const data = req.data
    const isValid = data
        && "first-name" in data
        && "last-name" in data
        && (data["first-name"]?.toString().trim().length || 0) > 0
        && (data["last-name"]?.toString().trim().length || 0) > 0

    if (isValid) {
        res.send(`Hello, ${data['first-name']} ${data['last-name']}.
            Welcome to our Website.`)
    } else {
        res.send("Both first name and last name are required")
    }
})

/**
 * Route parameters
 */
app.get('/name/:fname/:lname', (req, res) => {
    console.info(req.params)
    res.send(`Hello, ${req.params.fname} ${req.params.lname}!`)
})

/**
 * Serving static files with route params
 */
app.get('/users/:userid/profile_photo', (req, res) => 
    res.sendFile(path.join(IMG_DIR, `profile_photo_${req.params.userid}.jpeg`)))

/**
 * Middleware that throws an error
 */
app.get('/break-it', (req, res) => {
    throw new Error('Uh-oh')
})

/**
 * Error handling middleware
 * (Always has 4 parameters)
 */
app.use((err: Error, req: e.Request, res: e.Response, next: e.NextFunction) => {
    console.error(err)
    res.status(500).send('Something broke!')
})

/**
 * Default route (reached after everything fails)
 */
app.use((req, res) => {
    res.send('This resource does not exist')
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
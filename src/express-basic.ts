import e from "express"
import * as path from "path"

const port = process.argv[2] || 3000
const app = e()

/**
 * Dynamic route 1
 */
app.get('/hello', (req, res) => res.send('Hello World!'));

/**
 * Dynamic route 2
 */
app.get('/goodbye', (req, res) => res.send('Goodbye World!'));

/**
 * Route with the "static" middleware
 */
 app.use('/static', e.static(path.join(__dirname,  'static')))



/**
 * Server start-up
 */
app.listen(port, () => `Listening on port ${port}`)
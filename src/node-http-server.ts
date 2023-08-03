/**
 * How to create a simple web server using a 
 * plain http library.
 */
import * as http from "http"

const port = process.argv[2] || 3000
const server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Hello World!')
})

server.listen(port, () => console.log(`Server is listening on port ${port}`))


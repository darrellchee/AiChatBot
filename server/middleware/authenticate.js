// server/middleware/authenticate.js
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || ''
  const token = authHeader.startsWith('Bearer ') && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token missing' })

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Token invalid' })
    req.user = payload    // { id, userName }
    next()
  })
}

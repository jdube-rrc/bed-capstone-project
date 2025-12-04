import { Router } from 'express'
import asciiController from '../controller/asciiController'

const router = Router()

// GET /api/v1/meta/ascii
router.get('/ascii', asciiController.getAscii)

export default router

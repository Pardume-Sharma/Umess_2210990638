import express from 'express';
import { getMenu, addMenu, editMenu, deleteMenu } from '../controllers/menuController.js';

const menuRouter = express.Router();

/**
 * @swagger
 * /api/menu/getMenu:
 *   get:
 *     summary: Get Menu
 *     description: Retrieve all menu items sorted by day
 *     tags: [Menu Management]
 *     responses:
 *       200:
 *         description: Menu retrieved successfully
 */
menuRouter.get('/getMenu', getMenu);

/**
 * @swagger
 * /api/menu/addMenu:
 *   post:
 *     summary: Add Menu
 *     description: Create a new menu for a specific day
 *     tags: [Menu Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *               breakfast:
 *                 type: array
 *                 items:
 *                   type: string
 *               lunch:
 *                 type: array
 *                 items:
 *                   type: string
 *               dinner:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Menu added successfully
 */
menuRouter.post('/addMenu', addMenu);

/**
 * @swagger
 * /api/menu/editMenu/{id}:
 *   put:
 *     summary: Edit Menu
 *     description: Update an existing menu by ID
 *     tags: [Menu Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu updated successfully
 */
menuRouter.put('/editMenu/:id', editMenu);

/**
 * @swagger
 * /api/menu/deleteMenu/{id}:
 *   delete:
 *     summary: Delete Menu
 *     description: Remove a menu by ID
 *     tags: [Menu Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu deleted successfully
 */
menuRouter.delete('/deleteMenu/:id', deleteMenu);

export default menuRouter;

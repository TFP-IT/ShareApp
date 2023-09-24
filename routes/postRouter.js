import { Router } from "express";
import { getPostDetails } from "../controllers/postController.js";


const postRouter = Router();

postRouter.get('/:id', getPostDetails)

export default postRouter;
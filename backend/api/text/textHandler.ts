import express, { Express, NextFunction, Request, Response, Router } from 'express';
import {addPost, getPostById, getAllPosts, deletePostById, updatePostById} from "./database";
import { Post, JsonResponse, PostWithId, Option } from './types';

const router: Router = express.Router()

router.get("/text", (req: Request, res: Response )=>{
    let id: number = getIdFromQuery(req);
    const posts = getAllPosts();
    res.send(posts);
})

router.get("/text/:id", checkContainsId, (req: Request, res: Response )=>{
    let id: number = getIdFromQuery(req);
    const [post, success] = getPostById(id);
    res.send(
        createResponse(
            success,
            post,
            "GETONE"
        )
        );
})

router.post("/text", checkContainsPost, (req: Request, res: Response )=>{
    const post: Post = getPostFromBody(req)!;
    const success = addPost(post);
    res.send(
        createResponse(
            success,
            null,
            "POST"
        )
    );

})


router.put("/text/:id", checkContainsId, checkContainsPost, (req: Request, res: Response )=>{
    let id: number = getIdFromQuery(req);
    const post: Post = getPostFromBody(req)!;
    const success = updatePostById(post, id);
    res.send(
        createResponse(
            success,
            null,
            "PUT"
        )
    );
})

router.delete("/text/:id", checkContainsId, (req: Request, res: Response )=>{
    let id: number = getIdFromQuery(req);
    let success: boolean = deletePostById(id);
    res.send(
        createResponse(
            success,
            null,
            "DELETE"
        )
    );

})

function checkContainsId(req: Request, res: Response, next: NextFunction ){
    // console.log("kbhhjhj", req.params, parseInt(req.params.id.toString()))
    if (req.params.id != undefined){
        if (parseInt(req.params.id.toString())!=undefined){
           next()
           return
        }
    } 
    res.send({error: "missing [id] parameter in url"})    
}

function checkContainsPost(req: Request, res: Response, next: NextFunction){

    if (getPostFromBody(req)==null){
        res.send({error: "missing content to be posted"})
    } else{
        next()
    }
}

function getIdFromQuery(req: Request):number{
    return parseInt(req.params.id?.toString()||"-1");
}

function getPostFromBody(req: Request):Post|null{
    let body = req.headers.body;
    if (body ==undefined)
      return null
    else 
       return JSON.parse(body.toString())
}

function createResponse(success:boolean, post:Option<PostWithId<Post>,null>, message:string=""):object{
    if (post==null){
        return {success, message};
    } else {
        return {success, post, message};
    }
}


export default router;
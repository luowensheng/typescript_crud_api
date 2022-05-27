import {Post, Database, Collection, PostWithId} from "./types";

const col = "text";
const db: Database = new Database(
    "textDb",
    new Collection<Post>(col)
);


export function addPost(post: Post):boolean{
      return db.get(col)?.insert(post)||false;
}

export function updatePostById(post:Post, id: number):boolean{
    return db.get(col)?.update(id, post)||false;
}

export function deletePostById(id: number):boolean{
    return db.get(col)?.delete(id)||false; 

}

export function getPostById(id: number): [PostWithId<Post>|null, boolean]{
    let post = db.get(col)?.read(id)||null;
    return [post, post!=null]
}

export function getAllPosts(): PostWithId<Post>[]{
    const data = db.get(col)?.readAll()||[];
    console.log(data.length);
    return data;
}
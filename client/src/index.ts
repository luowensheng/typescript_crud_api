import fetch, { Response } from 'node-fetch';
import {Post, PostResponse} from './types';

const url: string = "http://localhost:8000/api/v1/text"
const headers =  {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                }

let json = JSON.stringify({text:url})                
async function getRequest(url: string){
    const response:Response = await fetch(url)
    const data = await response.json();
    return data
}

async function postRequest(url: string, post: Post){
    const response:Response = await fetch(url, {method:"POST", 
                                                headers:{...headers, 
                                                    body:JSON.stringify(post)}
                                            })
    const data = await response.json();
    return data
}


async function putRequest(url: string, post:Post){
    const response:Response = await fetch(url, {method:"PUT",
                                                headers:{...headers, 
                                                    body:JSON.stringify(post)}                                               
                                            })
    const data = await response.json();
 
    return data
}


async function deleteRequest(url: string){
    const response:Response = await fetch(url, {method:"DELETE"})
    const data = await response.json();
    return data
}

async function main(){
    let q = "/"  ; //?id=
    let n =  500;
    const do_post =  true;
    const do_get =  true;
    const do_put =  true;
    const do_delete =  false;

    if (do_post)
    for (let i=0; i< n; i++){
        let urls = `${url}`;
        let post = {text: `this is post number ${i}`};
        let data = await postRequest(urls, post);
        console.assert(true, data.success)
        console.log(i, data)

    }

    if (do_get)
    for (let i=0; i< n; i++){
        let urls = `${url}${q}${i}`; 
        let data = await getRequest(urls);
        console.assert(true, data.success)
        // console.log(i, data)
    }

    if (do_put)
    for (let i=0; i< n/10; i++){
        let urls = `${url}${q}${i}`; 
        let post = {text: `[updated] this is post number ${i}`};
        let data = await putRequest(urls, post);
        console.assert(true, data.success)
        // console.log(i, data)

    }

    if (do_delete)
    for (let i=n/4; i< n/2; i++){
        let urls = `${url}${q}${i}`; 
        let data = await deleteRequest(urls);
        console.assert(true, data.success)
        // console.log(i, data)

    }

   const data: PostResponse[] = await getRequest(url);
   data.sort((a, b)=>a.id-b.id)
   console.log(data, data.length)
}

main()

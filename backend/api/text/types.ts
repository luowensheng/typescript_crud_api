export interface Post {
    text: String
}
export interface PostWithId<T> {
    post: T
    id: number
}

export interface JsonResponse<T> {
    success: boolean,
    message: string,
    post:Option<PostWithId<T>, null>
}

export type Option<U, V> = U|V ; 

export interface ICollection<T> {
      data: Map<number, PostWithId<T>>;
      readonly name: string;
      insert(item: T):boolean;
      update(id:number, item: T):boolean;
      read(id:number):Option<PostWithId<T>, null>;
      readAll():PostWithId<T>[];
      delete(id:number):boolean;
}

export interface IDatabase {
    collections: Map<string,ICollection<any>>;
    readonly name: string;
    addCollection(collection: ICollection<any>):void;
    get(collectionName:string):Option<ICollection<any>, null>;
}

export interface Query {
    id: number
}

export class Database implements IDatabase {

    name: string;
    collections: Map<string,ICollection<any>>;
    
    constructor(name: string, collection:Option<ICollection<any>, null>=null){
        this.name = name;
        this.collections =  new Map();
        if (collection!=null)
            this.addCollection(collection)
    }

    addCollection(collection: ICollection<any>): void {
        this.collections.set(collection.name, collection);
    }

    get(collectionName: string){
        return this.collections.get(collectionName)||null
    }
}

function doOperation(operation: Function): boolean{
    try {
        operation();
        return true;
    } catch (error) {
        return false;
    } 
}

function toPostWithId<T>(post:T, id:number): PostWithId<T>{
    return {post, id}
}

export class Collection<T> implements ICollection<T> {
    data: Map<number, PostWithId<T>>;
    readonly name: string;
    
    constructor(name:string){
        this.name = name;
        this.data = new Map();
    }

    insert(item: T):boolean{
        let id  = this.data.size;
        return this.insertWithId(id, toPostWithId(item, id));
    }

    private insertWithId(id:number, item: PostWithId<T>):boolean{
        return doOperation(()=>this.data.set(id, item));
    }

    update(id:number, item: T):boolean{
        return doOperation(()=>{
               let deleteSuccess: boolean = this.delete(id);
               if (deleteSuccess){
                   this.insertWithId(id, toPostWithId(item, id));
               }
        });
    }

    read(id:number):Option<PostWithId<T>, null>{
        let item = null;
        doOperation(()=>{
           item = this.data.get(id);
        });
        return item;
    }

    readAll(): PostWithId<T>[] {
        let posts:PostWithId<T>[] = [];
        for (let key of this.data.keys()){
            let item = this.read(key);
            if (item!=null) posts.push(item);
        }
       return posts;
    }

    delete(id:number):boolean{
        return doOperation(()=>{
           this.data.delete(id);
        })
    }
}

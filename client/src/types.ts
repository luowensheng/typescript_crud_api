export interface Post {
    text: String
}

export interface PostResponse {
    id: number,
    post: Post
}

export interface Database {
    [map: number]: Post;
    length: number

}

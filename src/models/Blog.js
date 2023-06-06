class Blog{
    constructor(id, title, description, image, username, user_id, isConfirmed = false, views = 0, likes = 0) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
        this.username = username;
        this.user_id = user_id;
        this.isConfirmed = isConfirmed;
        this.views = views;
        this.likes = likes;
    }
}

module.exports = Blog;
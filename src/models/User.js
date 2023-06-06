class User{
    constructor(id, username, password, role = 'user') {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }
}

module.exports = User;
# Blog App API Documentation
### Overview
A blogging platform (Blog Voyage) API that allows users to create, read, update, and delete blog posts. It provides endpoints for user authentication, blog management, and blog retrieval.
### Features
- User authentication using JWT tokens.
- Creation, retrieval, updating, and deletion of blog posts.
- Filtering, sorting, and pagination of blog posts.
- Calculation of reading time for blog posts.
- Search functionality for blog posts.
- Error handling and validation of input data
- Logging of application events using Winston
### Installation Steps
To install and run the Blog App on your local machine, follow these steps:
1. Clone the Blog App repository from GitHub:
``` markdown
git clone https://github.com/Chisquare7/nodeJS-blog-app-api.git
```
2. Navigate to Project Directory:
``` markdown
cd blog-app
```
3. Install Dependencies:
``` markdown
npm install
```
4. Set Environment Variables:
  - Create a .env file in the root directory and add the following environment variables:
    ``` markdown
    PORT: Port number for the application (e.g., 3000).
    DB_URL: MongoDB connection URL.
    JWT_SECRET: Your-jwt-secret
    ```
5. Run the Application:
``` markdown
npm start
```
6. Access the Application:
Once the server runs, you can access the application at `http://localhost:<PORT>` in your web browser.
### Endpoints
#### User Authentication
- `POST /users/signup` - Sign up a new user.
- `POST /users/login` - Log in an existing user.
#### Blog Operations
- `GET /blogs/blogs` - Retrieve a list of published blogs.
- `GET /blogs/blogs/:id` - Retrieve a single published blog.
- `POST /blogs/create` - Create a new blog post.
- `PUT /blogs/update/:id` - Update an existing blog post.
- `DELETE /blogs/delete/:id` - Delete an existing blog post.
- `GET /users/my-blogs` - Retrieve a list of user's blogs (requires authentication).
- `GET /users/blogs/:id` - Retrieve a single user's blog (requires authentication).
- `PUT /users/updateState/:id` - Update the state of a user's blog to published (requires authentication).
#### Filtering, Sorting, and Pagination
- Blogs can be filtered by state (draft/published).
- Blogs can be sorted by read count, reading time, and timestamp.
- Pagination is supported with query parameters page and limit.
#### Search
- `GET /blogs/search=query=-timestamp` - Search for blogs by author, title, or tags.
### Usage
1. Sign Up:
``` markdown
`POST /users/signup`
Body: {
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "gender": "male"
}
```
2. Login:
``` markdown
`POST /users/login`
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```
3. Retrieve List of Blogs:
``` markdown
`GET /blogs/blogs`
```
4. Create a New Blog Post:
``` markdown
`POST /blogs/create`
Authorization: Bearer <JWT token>
Body: {
  "title": "Sample Blog",
  "description": "This is a sample blog post",
  "tags": ["sample", "example"],
  "body": "Lorem ipsum dolor sit amet..."
}
```
5. Update an Existing Blog Post:
``` markdown
`PUT /blogs/update/:id`
Authorization: Bearer <JWT token>
Body: {
  "title": "Updated Blog Title",
  "description": "Updated description...",
  "body": "Updated content..."
}
```
6. Delete an Existing Blog Post:
``` markdown
`DELETE /blogs/delete/:id`
Authorization: Bearer <JWT token>
```
7. Retrieve List of User's Blogs:
``` markdown
`GET /users/my-blogs`
Authorization: Bearer <JWT token>
```
8. Retrieve a Single User's Blog:
``` markdown
`GET /users/blogs/:id`
Authorization: Bearer <JWT token>
```
9. Publish a User's Draft Blog:
``` markdown
`PUT /users/updateState/:id`
Authorization: Bearer <JWT token>
```
### Dependencies
- Express.js: Web application framework for Node.js.
- Mongoose: MongoDB object modeling for Node.js.
- JWT: JSON Web Token for user authentication.
### Configuration
- Port: The application runs on the port specified in the `.env` file.
- Database URL: MongoDB connection URL specified in the `.env` file.
- JWT Secret: Secret key for JWT token generation specified in the `.env` file.
### Deployment
  - Testable URL: [Blog Voyage](https://blog-voyage-app.onrender.com/)
### Developer
> Chibuike Chijioke | [LinkedIn](https://www.linkedin.com/in/chibuike-chijioke-47520823a/)
###### © Code Chi 2024

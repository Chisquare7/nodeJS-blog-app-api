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

```
### Base URL
The base URL for accessing the Blog App API is: `http://localhost:<PORT>`
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

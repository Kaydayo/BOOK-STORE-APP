# BOOK-APP
# EXPRESS 

### Techmologies
1. Typescript
2. Express
3. Mongodb
4. Html5
5. CSS3

## Screenshots:
  ![Screenshot1](screenshot1.png)
  ![Screenshot2](screenshot2.png)


## CRUD OPERATIONS
- BASIC CRUD .
  - `GET` Request which returns all the data in your database.json data
  - `POST` Request which adds data to your database.json file (Note: If there is no database.json on post, create one dynamically).
  - `PUT` Request which updates fields of a particular data using the id in database.json
  - `DELETE` Request which removes a particular data from your database.json using the id


```javascript
[
    {
      id: 1,
      author: "John Stone",
      dateRegistered: 1637159465420,
      age: 28,
      address: "5, Wall Street, Buckingham",
      books: [
        {
          id: "book1"
          name: "Tomorrow is coming",
          isPublished: true,
          datePublished: 1637159508581,
          serialNumber: 0010
        },
        {
          id: "book2"
          name: "October's very own",
          isPublished: false,
          datePublished: null,
          serialNumber: null
        }
      ]
    }
]
```
## Test coverage
- Testing was covered using supertest

### Test
- Test for a GET request
- Test for a POST request
- Test for a PUT request
- Test for a DELETE request
- Test to return proper HTTP status codes



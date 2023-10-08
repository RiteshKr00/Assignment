## Architechure

Used MVC architecture because :

- code more organized and easier to maintain
- add new features without affecting the existing code.
- By separating the different parts we can easily optimize the performance

### Hashing and Encoding

- Used SHA256 for generating hash of the url
- Then used base 64 encoding to convert the hash into a shorter, fixed-length string
- Used time stamp as unique identifier just before base64 encoding to avoid collision

## Check Documentation

<!-- []()
Screenshot: -->

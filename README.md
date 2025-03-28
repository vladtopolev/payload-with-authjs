
Run docker locally with PostgreSQL:
```
docker run --name sql-database \
  -e POSTGRES_DB=db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres
  ```
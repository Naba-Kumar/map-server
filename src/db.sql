CREATE TABLE my_shapefile (
  gid serial PRIMARY KEY,
  name varchar(50),
  description varchar(200),
  geom geometry(Geometry, 4326),
  display_picture_url varchar(255)
);

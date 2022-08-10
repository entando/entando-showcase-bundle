# entando-showcase-bundle
A showcase bundle including many use cases, demonstrating the different configuration parameters of a bundle descriptor

## How to test
Deploy the bundle with the following command:

```
ent bundle generate-cr --image entando/entando-showcase-bundle | ent k apply -n entando -f -
```

- After installing the bundle, remember to add the `another-ms-user` role to the user used for the test, importing it from the `another-ms` client in Keycloak
- Go to `Jeff's Bundle Page`, drag `Another MFE` widget to the page, edit widget configuration parameters and display the page
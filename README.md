# entando-showcase-bundle
A showcase bundle including many use cases, demonstrating the different configuration parameters of a bundle descriptor

## How to test
Deploy the bundle with the following command:

```
ent bundle generate-cr --image entando/entando-showcase-bundle | ent k apply -n entando -f -
```

- After installing the bundle, remember to:
  - open the keycloak administration console
  - click on Users in the sidebar menu
  - select your desired user from the list
  - select the "Role Mappings" tab
  - open the "Client Roles" dropdown
  - select "pn-c0e268b3-9f21bf63-entando-another-ms-server"
  - from the "Available Roles" on the left, select the "another-ms-user" and click the "Add selected" button
- Go to `Jeff's Bundle Page`, drag `Another MFE` widget to the page, edit widget configuration parameters and display the page

using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

// --- 1. Keycloak (Identity Provider) ---
// var keycloak = builder.AddKeycloakContainer("keycloak", port: 8080)
//                       .WithDataVolume();
// Use plain Docker container to avoid import issues
 var keycloak = builder.AddContainer("keycloak", "quay.io/keycloak/keycloak", "26.3.3")
                    .WithHttpEndpoint(port: 8080, targetPort: 8080)
                    .WithEnvironment("KEYCLOAK_ADMIN", "admin")
                    .WithEnvironment("KEYCLOAK_ADMIN_PASSWORD", "admin")
                    .WithArgs("start-dev")
                    .WithVolume("keycloak-data", "/opt/keycloak/data");

// Note: AddRealm is not available for plain containers
// The realm will need to be configured manually in Keycloak admin console

// --- 2. .NET API (Resource Server) ---
var apiService = builder.AddProject<Projects.AspireApp_ApiService>("apiservice");

// --- 3. Angular Frontend (Client Application) ---
var angular = builder.AddNpmApp("angular-client", "../angular-client")
    .WithReference(apiService) // Allows Angular to find the API URL
    .WithHttpEndpoint(port: 4200, env: "PORT") // Fixed port 4200 to match package.json
    .WithExternalHttpEndpoints();   // Makes it accessible from your browser



builder.Build().Run();
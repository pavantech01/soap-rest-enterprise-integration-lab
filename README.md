# SOAP vs REST Enterprise Incident Management Demo

A runnable learning project with Angular 19, Java 17, Spring Boot, Apache CXF SOAP, REST/JSON, Spring Data JPA and SQL Server 2022.

## Architecture

- Angular UI: `http://localhost:4200`
- REST API: `http://localhost:8080/api/incidents`
- SOAP endpoint: `http://localhost:8080/soap/IncidentService`
- WSDL: `http://localhost:8080/soap/IncidentService?wsdl`
- SQL Server: `localhost:1433`, database `IncidentDemo`

Both protocol adapters call the same `IncidentApplicationService` and persist to the same SQL Server table.

## Prerequisites

- Windows 11
- Docker Desktop (Linux containers)
- Java 17 JDK (`java -version`)
- Maven 3.9+ (`mvn -version`)
- Node.js 20.11+ and npm (`node -v`, `npm -v`)
- Angular CLI 19 (`npm install -g @angular/cli@19`)

## 1. Start SQL Server

From this project folder:

```powershell
docker compose up -d
docker compose ps
```

Wait until the SQL Server container is running. Create the demo database once:

```powershell
docker exec soap-rest-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -C -Q "IF DB_ID('IncidentDemo') IS NULL CREATE DATABASE IncidentDemo"
```

The application creates the `Incidents` table through Hibernate on first startup.

Connection settings are in `backend/src/main/resources/application.properties`.
For local learning only, the sample SA password is `YourStrong!Passw0rd`. Change it before using this outside a local machine.

## 2. Start the Java backend

Open a PowerShell terminal:

```powershell
cd backend
mvn spring-boot:run
```

First run downloads Maven dependencies. Verify:

- REST: `http://localhost:8080/api/incidents`
- WSDL: `http://localhost:8080/soap/IncidentService?wsdl`

The REST URL should return `[]` initially. The WSDL URL should display XML describing the SOAP contract.

## 3. Start Angular

Open a second PowerShell terminal:

```powershell
cd frontend
npm install
npm start
```

Open `http://localhost:4200`.

The Angular screen lets you create an incident through REST or SOAP, refresh the shared list through either protocol, and compare the response payloads.

## 4. Test REST with PowerShell

Create an incident:

```powershell
$body = @{
  title = "VPN not connecting"
  description = "Employee cannot connect to corporate VPN"
  priority = "HIGH"
  assignedGroup = "IT SUPPORT"
  status = "OPEN"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:8080/api/incidents `
  -ContentType "application/json" `
  -Body $body
```

List incidents:

```powershell
Invoke-RestMethod http://localhost:8080/api/incidents
```

Get one incident (replace 1 with the returned ID):

```powershell
Invoke-RestMethod http://localhost:8080/api/incidents/1
```

## 5. Test SOAP with PowerShell

Create `create-incident-soap.xml` with this body:

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:inc="http://enterprise.demo/incident">
  <soap:Header/>
  <soap:Body>
    <inc:CreateIncidentRequest>
      <inc:title>Printer offline</inc:title>
      <inc:description>Floor 3 printer is not responding</inc:description>
      <inc:priority>MEDIUM</inc:priority>
      <inc:assignedGroup>WORKPLACE SUPPORT</inc:assignedGroup>
    </inc:CreateIncidentRequest>
  </soap:Body>
</soap:Envelope>
```

Send it:

```powershell
$xml = Get-Content .\create-incident-soap.xml -Raw
Invoke-WebRequest -Method Post `
  -Uri http://localhost:8080/soap/IncidentService `
  -ContentType "text/xml; charset=utf-8" `
  -Headers @{ SOAPAction = "" } `
  -Body $xml
```

The SOAP response includes the generated incident ID. The WSDL is generated from the annotated Java service contract by Apache CXF.

## 6. Verify cross-protocol interoperability

1. Create an incident using REST.
2. Copy its numeric `id`.
3. Refresh the Angular list using SOAP.
4. Confirm the REST-created incident appears.
5. Create another incident using SOAP.
6. Refresh using REST and confirm it appears.

Both protocol paths use the same service and SQL Server database.

## 7. Useful SQL verification

Connect with SSMS:

- Server: `localhost,1433`
- Authentication: SQL Server Authentication
- Login: `sa`
- Password: `YourStrong!Passw0rd`
- Database: `IncidentDemo`

Run:

```sql
SELECT Id, Title, Priority, Status, AssignedGroup, CreatedAt
FROM dbo.Incidents
ORDER BY Id DESC;
```

Hibernate creates the schema automatically in this demo.

## 8. SOAP vs REST: what to inspect

| Topic | REST | SOAP |
|---|---|---|
| Payload | JSON | XML envelope |
| Contract | OpenAPI is commonly added separately | WSDL |
| Endpoint | Resource URL | Service endpoint + operation |
| HTTP method | GET/POST/PUT/DELETE | Usually POST |
| Errors | HTTP status + JSON | SOAP Fault |
| Typical use | Web/mobile APIs, microservices | Enterprise integrations, contract-first/legacy systems |

SOAP is not automatically more secure than REST. Production systems need TLS, authentication, authorization, input validation, secret management, logging and monitoring regardless of protocol.

## Troubleshooting

- SQL login error: ensure Docker container is healthy and the password matches `application.properties`.
- Port 1433 busy: stop the other SQL Server instance or change the host port in Compose and JDBC URL.
- WSDL 404: check that backend started successfully; inspect Maven output.
- SOAP 500: inspect the backend console. Ensure the XML namespace is `http://enterprise.demo/incident`.
- Angular CORS: backend allows `http://localhost:4200` for this local demo.
- Java version: run `java -version`; this project targets Java 17.
- If Docker healthcheck reports a missing `sqlcmd` path in a newer image, the healthcheck is informational; verify readiness by connecting from SSMS or the backend logs.

## Production hardening checklist

- Replace sample credentials and move secrets to environment variables or a vault.
- Use a least-privilege SQL login instead of `sa`.
- Use HTTPS/TLS and real authentication (OAuth2/OIDC for REST; WS-Security where SOAP requirements demand it).
- Add DTO validation, pagination, rate limits, audit trails and structured logs.
- Use Flyway or Liquibase migrations instead of Hibernate `ddl-auto=update`.
- Add unit, integration, contract and end-to-end tests.
- Do not expose detailed stack traces or SQL errors to clients.

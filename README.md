# Strata.DSS.CostAccounting

### SonarQube Metrics

[![Quality Gate Status](https://sonarqube.sdt.local/api/project_badges/measure?project=Strata.DSS.CostAccounting&metric=alert_status)](https://sonarqube.sdt.local/dashboard?id=Strata.DSS.CostAccounting)
[![Bugs](https://sonarqube.sdt.local/api/project_badges/measure?project=Strata.DSS.CostAccounting&metric=bugs)](https://sonarqube.sdt.local/dashboard?id=Strata.DSS.CostAccounting)
[![Code Smells](https://sonarqube.sdt.local/api/project_badges/measure?project=Strata.DSS.CostAccounting&metric=code_smells)](https://sonarqube.sdt.local/dashboard?id=Strata.DSS.CostAccounting)
[![Coverage](https://sonarqube.sdt.local/api/project_badges/measure?project=Strata.DSS.CostAccounting&metric=coverage)](https://sonarqube.sdt.local/dashboard?id=Strata.DSS.CostAccounting)
[![Duplicated Lines (%)](https://sonarqube.sdt.local/api/project_badges/measure?project=Strata.DSS.CostAccounting&metric=duplicated_lines_density)](https://sonarqube.sdt.local/dashboard?id=Strata.DSS.CostAccounting)
[![Maintainability Rating](https://sonarqube.sdt.local/api/project_badges/measure?project=Strata.DSS.CostAccounting&metric=sqale_rating)](https://sonarqube.sdt.local/dashboard?id=Strata.DSS.CostAccounting)
[![Reliability Rating](https://sonarqube.sdt.local/api/project_badges/measure?project=Strata.DSS.CostAccounting&metric=reliability_rating)](https://sonarqube.sdt.local/dashboard?id=Strata.DSS.CostAccounting)
[![Security Rating](https://sonarqube.sdt.local/api/project_badges/measure?project=Strata.DSS.CostAccounting&metric=security_rating)](https://sonarqube.sdt.local/dashboard?id=Strata.DSS.CostAccounting)
[![Technical Debt](https://sonarqube.sdt.local/api/project_badges/measure?project=Strata.DSS.CostAccounting&metric=sqale_index)](https://sonarqube.sdt.local/dashboard?id=Strata.DSS.CostAccounting)
[![Vulnerabilities](https://sonarqube.sdt.local/api/project_badges/measure?project=Strata.DSS.CostAccounting&metric=vulnerabilities)](https://sonarqube.sdt.local/dashboard?id=Strata.DSS.CostAccounting)

### Drone Build Status

[![Build Status](https://drone.ops.stratanetwork.net/api/badges/TEMP/api/status.svg)](https://drone.ops.stratanetwork.net/TEMP/api)
</a>

## Branching and Versioning

| branch     | version format        | example         |
| ---------- | --------------------- | --------------- |
| master     | #.#.#                 | 1.2.3           |
| feature/\* | #.#+1.0-featureName.# | 1.3.0-newfeat.1 |
| fix/\*     | #.#.#+1-fixName.#     | 1.2.4-bug.1     |

See our [confluence page](https://confluence.sdt.local/display/DOP/Branching+and+Versioning) for more information

## Usage

### Build and Run

```
docker-compose up -d --build
```

- https://localhost:8443/index (swagger api)
- https://localhost:8443/hangfire (hangfire dashboard)
- http://localhost:8081 (redis commander)

### Extracting nuget package

```
docker create --name throwaway stratacostaccounting_costaccounting-api
docker cp throwaway:/pack .
docker rm throwaway
```

### Cleanup

```
docker-compose down
```

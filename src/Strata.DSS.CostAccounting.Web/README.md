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

### TeamCity Build Status
<a href="https://teamcity.sdt.local/viewType.html?buildTypeId=Services_StrataCostAccounting_01Build&guest=1"> 
<img src="https://teamcity.sdt.local/app/rest/builds/buildType(id:Services_StrataCostAccounting_01Build)/statusIcon"/>
</a>

## Branching and Versioning
|branch|version format|example|
|---|---|---|
|master|#.#.#|1.2.3|
|feature/*|#.#+1.0-featureName.#|1.3.0-newfeat.1|
|fix/*|#.#.#+1-fixName.#|1.2.4-bug.1|

See our [confluence page](https://confluence.sdt.local/display/DOP/Branching+and+Versioning) for more information

## Usage
### Building
```
docker build -t strata.dss.costaccounting.web:local .
```

### Running
```
docker run --rm -it -p 8080:80 -p 8443:443 strata.dss.costaccounting.web:local
```
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/statistic-drivers")]
    public class StatisticDriversController : ControllerBase
    {
        private readonly ICostAccountingRepository _costaccountingRepository;
        private readonly ICostingConfigRepository _costingConfigRepository;
        private readonly IStatisticDriversRepository _statisticDriversRepository;
        private readonly IStatisticDriversService _statisticDriversService;
        private readonly IDataSourceService _dataSourceService;
        private readonly IDataSourceLinkService _dataSourceLinkService;

        public StatisticDriversController(ICostAccountingRepository costaccountingRepository
                                            , IStatisticDriversRepository statisticDriversRepository
                                            , IStatisticDriversService statisticDriversService
                                            , ICostingConfigRepository costingConfigRepository
                                            , IDataSourceService dataSourceService
                                            , IDataSourceLinkService dataSourceLinkService)
        {
            _costaccountingRepository = costaccountingRepository;
            _statisticDriversRepository = statisticDriversRepository;
            _statisticDriversService = statisticDriversService;
            _costingConfigRepository = costingConfigRepository;
            _dataSourceService = dataSourceService;
            _dataSourceLinkService = dataSourceLinkService;
        }

        [HttpGet("")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<StatisticDriver>>> GetStatisticDrivers(CancellationToken cancellationToken)
        {
            //TODO pass in costing config with Naviation BLI
            //dev patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("da9eef04-3c9d-445b-b0c4-3a7812ca76d8"), cancellationToken);
            //kaiser patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("0f559827-4df4-4f1d-843e-d49a1e1c649d"), cancellationToken);
            //kaiser claims
            var costingConfig = await _costingConfigRepository.GetCostingConfigAsync(new Guid("2adafbaa-c365-472a-94f1-79b823d8547a"), cancellationToken);
            var statisticDrivers = await _statisticDriversService.LoadStatisticDrivers(costingConfig.Type);
            return Ok(statisticDrivers);
        }

        [HttpGet("data-sources")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<DataTable>>> GetDataSources(CancellationToken cancellationToken)
        {
            //TODO pass in costing config with Naviation BLI
            //dev patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("da9eef04-3c9d-445b-b0c4-3a7812ca76d8"), cancellationToken);
            //kaiser patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("0f559827-4df4-4f1d-843e-d49a1e1c649d"), cancellationToken);
            //kaiser claims
            var costingConfig = await _costingConfigRepository.GetCostingConfigAsync(new Guid("2adafbaa-c365-472a-94f1-79b823d8547a"), cancellationToken);
            var isClaims = costingConfig.Type == CostingType.Claims;
            var dataSources = _dataSourceService.GetDataSources(isClaims);
            return Ok(dataSources);

        }

        [HttpGet("data-source-links")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<DataSourceLink>>> GetDataSourceLinks(CancellationToken cancellationToken)
        {
            //TODO pass in costing config with Naviation BLI
            //dev patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("da9eef04-3c9d-445b-b0c4-3a7812ca76d8"), cancellationToken);
            //kaiser patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("0f559827-4df4-4f1d-843e-d49a1e1c649d"), cancellationToken);
            //kaiser claims
            var costingConfig = await _costingConfigRepository.GetCostingConfigAsync(new Guid("2adafbaa-c365-472a-94f1-79b823d8547a"), cancellationToken);
            var isClaims = costingConfig.Type == CostingType.Claims;
            var dataSourceLinks = await _dataSourceLinkService.GetDataSourceLinks(isClaims);
            return Ok(dataSourceLinks);
        }


        [HttpPost("")]
        [ProducesResponseType(200)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<StatisticDriver>>> SaveStatisticDrivers([FromBody] StatisticDriverSaveData statisticDriverSaveData, CancellationToken cancellationToken)
        {
            if (_statisticDriversService.ValidateStatisticDrivers(statisticDriverSaveData.UpdatedStatDrivers))
            {
                if (statisticDriverSaveData.UpdatedStatDrivers.Count > 0)
                {
                    await _statisticDriversRepository.UpdateStatisticDriversAsync(statisticDriverSaveData.UpdatedStatDrivers, cancellationToken);
                }
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            if (statisticDriverSaveData.DeletedStatDrivers.Count > 0)
            {
                await _statisticDriversRepository.DeleteStatisticDriversAsync(statisticDriverSaveData.DeletedStatDrivers, cancellationToken);
            }

            var costingConfig = await _costingConfigRepository.GetCostingConfigAsync(statisticDriverSaveData.CostingConfigGuid, cancellationToken);
            var statDrivers = await _statisticDriversService.LoadStatisticDrivers(costingConfig.Type);

            return Ok(statDrivers);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/statistic-drivers")]
    public class StatisticDriversController:ControllerBase
    {
        private readonly ICostAccountingRepository _costaccountingRepository;
        private readonly IStatisticDriversRepository _statisticDriversRepository;
        private readonly IStatisticDriversService _statisticDriversService;
        private readonly IDataSourceService _dataSourceService;
        private readonly IDataSourceLinkService _dataSourceLinkService;

        public StatisticDriversController(ICostAccountingRepository costaccountingRepository, IStatisticDriversRepository statisticDriversRepository, IStatisticDriversService statisticDriversService,IDataSourceService dataSourceService, IDataSourceLinkService dataSourceLinkService)
        {
            _costaccountingRepository = costaccountingRepository;
            _statisticDriversRepository = statisticDriversRepository;
            _statisticDriversService = statisticDriversService;
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
            var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("2adafbaa-c365-472a-94f1-79b823d8547a"), cancellationToken);
            var statisticDrivers = await _statisticDriversService.LoadStatisticDrivers(costingConfig);
            return Ok(statisticDrivers);
        }

        [HttpGet("DataSources")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<DataTable>>> GetDataSources(CancellationToken cancellationToken)
        {
            //TODO pass in costing config with Naviation BLI
            //dev patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("da9eef04-3c9d-445b-b0c4-3a7812ca76d8"), cancellationToken);
            //kaiser patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("0f559827-4df4-4f1d-843e-d49a1e1c649d"), cancellationToken);
            //kaiser claims
            var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("2adafbaa-c365-472a-94f1-79b823d8547a"), cancellationToken);
            var isClaims = costingConfig.Type == CostingType.Claims ? true : false;
            var dataSources = _dataSourceService.GetDataSources(isClaims);
            return Ok(dataSources);
            
        }

        [HttpGet("DataSourceLinks")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<DataSourceLink>>> GetDataSourceLinks(CancellationToken cancellationToken)
        {
            //TODO pass in costing config with Naviation BLI
            //dev patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("da9eef04-3c9d-445b-b0c4-3a7812ca76d8"), cancellationToken);
            //kaiser patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("0f559827-4df4-4f1d-843e-d49a1e1c649d"), cancellationToken);
            //kaiser claims
            var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("2adafbaa-c365-472a-94f1-79b823d8547a"), cancellationToken);
            var isClaims = costingConfig.Type == CostingType.Claims ? true : false;
            var dataSourceLinks = await _dataSourceLinkService.GetDataSourceLinks(isClaims);
            return Ok(dataSourceLinks);
        }


        [HttpPost("")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<StatisticDriver>>>  SaveStatisticDrivers([FromBody] StatisticDriverSaveData statisticDriverSaveData, CancellationToken cancellationToken)
        {
            
            if (statisticDriverSaveData.AddedStatDrivers.Count>0)
            {
                if (! await _statisticDriversRepository.AddStatisticDriversAsync(statisticDriverSaveData.AddedStatDrivers, cancellationToken))
                {
                   //LogError
                };
            }
            if (statisticDriverSaveData.UpdatedStatDrivers.Count > 0)
            {
                if (!await _statisticDriversRepository.UpdateStatisticDriversAsync(statisticDriverSaveData.UpdatedStatDrivers, cancellationToken))
                {
                    //LogError
                };
            }
            if (statisticDriverSaveData.DeletedStatDrivers.Count > 0)
            {
                if (!await _statisticDriversRepository.DeleteStatisticDriversAsync(statisticDriverSaveData.DeletedStatDrivers, cancellationToken))
                {
                    //LogError
                };
            }

            //TODO pass in costing config with Naviation BLI
            //dev patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("da9eef04-3c9d-445b-b0c4-3a7812ca76d8"), cancellationToken);
            //kaiser patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("0f559827-4df4-4f1d-843e-d49a1e1c649d"), cancellationToken);
            //kaiser claims
            var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("2adafbaa-c365-472a-94f1-79b823d8547a"), cancellationToken);
            var statDrivers = await _statisticDriversService.LoadStatisticDrivers(costingConfig);
            return Ok(statDrivers);
        }
    }
}

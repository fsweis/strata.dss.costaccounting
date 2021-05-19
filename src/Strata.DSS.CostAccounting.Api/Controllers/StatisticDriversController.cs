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
using Strata.DSS.CostAccounting.Api.DTOs;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/statistic-drivers")]
    public class StatisticDriversController:ControllerBase
    {
        private readonly ICostAccountingRepository _costaccountingRepository;
        private readonly IStatisticDriversRepository _statisticDriversRepository;

        public StatisticDriversController(ICostAccountingRepository costaccountingRepository, IStatisticDriversRepository statisticDriversRepository)
        {
            _costaccountingRepository = costaccountingRepository;
            _statisticDriversRepository = statisticDriversRepository;
        }

        [HttpGet("")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<StatisticDriverDTO>>> GetStatisticDrivers(CancellationToken cancellationToken)
        {
            //dev patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfig(new Guid("da9eef04-3c9d-445b-b0c4-3a7812ca76d8"), cancellationToken);
            ///kaiser patient
            //var costingConfig = await _costaccountingRepository.GetCostingConfig(new Guid("0f559827-4df4-4f1d-843e-d49a1e1c649d"), cancellationToken);
            //kaiser claims
            var costingConfig = await _costaccountingRepository.GetCostingConfigAsync(new Guid("2adafbaa-c365-472a-94f1-79b823d8547a"), cancellationToken);
            
            StatisticDriversProvider statisticDriversProvider = new StatisticDriversProvider(_costaccountingRepository,_statisticDriversRepository, cancellationToken);
            await statisticDriversProvider.LoadStatisticDrivers(costingConfig);

            var statisticDriverDto = new StatisticDriverDTO() { 
                StatisticDrivers = statisticDriversProvider.StatisticDrivers, 
                DataSources = statisticDriversProvider.DataSources, 
                DataSourceLinks = statisticDriversProvider.DataSourceLinks
            };
            return Ok(statisticDriverDto);
        }

        [HttpGet("{driverConfigGUID}")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<bool>> ValidateRemove([FromRoute] Guid driverConfigGUID, CancellationToken cancellationToken)
        {
            return  await _statisticDriversRepository.ValidateRemoveAsync(driverConfigGUID, cancellationToken);
        }


        [HttpPost("SaveStatisticDrivers")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<bool>>  SaveStatisticDrivers([FromBody] StatisticDriverSaveData statisticDriverSaveData, CancellationToken cancellationToken)
        {
            if(statisticDriverSaveData.AddedStatDrivers.Count>0)
            {
                if (! await _statisticDriversRepository.AddStatisticDriversAsync(statisticDriverSaveData.AddedStatDrivers, cancellationToken))
                {
                    return false;
                };
            }
            if (statisticDriverSaveData.UpdatedStatDrivers.Count > 0)
            {
                if (!await _statisticDriversRepository.UpdateStatisticDriversAsync(statisticDriverSaveData.UpdatedStatDrivers, cancellationToken))
                {
                    return false;
                };
            }
            if (statisticDriverSaveData.DeletedStatDrivers.Count > 0)
            {
                if (!await _statisticDriversRepository.DeleteStatisticDriversAsync(statisticDriverSaveData.DeletedStatDrivers, cancellationToken))
                {
                    return false;
                };
            }

            return true;
        }
    }
}

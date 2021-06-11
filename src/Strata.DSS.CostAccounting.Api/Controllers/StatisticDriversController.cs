using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.Exceptions;
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
        private readonly IStatisticDriversRepository _statisticDriversRepository;
        private readonly IStatisticDriversService _statisticDriversService;
        private readonly IDataSourceService _dataSourceService;
        private readonly IDataSourceLinkService _dataSourceLinkService;

        public StatisticDriversController(IStatisticDriversRepository statisticDriversRepository
                                            , IStatisticDriversService statisticDriversService
                                            , IDataSourceService dataSourceService
                                            , IDataSourceLinkService dataSourceLinkService)
        {
            _statisticDriversRepository = statisticDriversRepository;
            _statisticDriversService = statisticDriversService;
            _dataSourceService = dataSourceService;
            _dataSourceLinkService = dataSourceLinkService;
        }

        [HttpGet("")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<StatisticDriver>> GetStatisticDrivers(CostingType costingType, CancellationToken cancellationToken)
        {
            IEnumerable<StatisticDriver> statisticDrivers;
            try
            {
                statisticDrivers = await _statisticDriversService.LoadStatisticDrivers(costingType, cancellationToken);
            }
            catch (Exception e)
            {
                throw new ApiException("Error calling GetStatisticDrivers", e);
            }
            return statisticDrivers;
        }

        [HttpGet("data-sources")]
        [ProducesResponseType(200)]
        public IEnumerable<DataTable> GetDataSources(CostingType costingType)
        {
            var dataSources = _dataSourceService.GetDataSources(costingType);

            return dataSources;
        }

        [HttpGet("data-source-links")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<DataSourceLink>> GetDataSourceLinks(CostingType costingType, CancellationToken cancellationToken)
        {
            IEnumerable<DataSourceLink> dataSourceLinks;
            try
            {
                dataSourceLinks = await _dataSourceLinkService.GetDataSourceLinks(costingType, cancellationToken);
            }
            catch (Exception e)
            {
                throw new ApiException("Error calling GetDataSourceLinks", e);
            }
            return dataSourceLinks;
        }

        [HttpPost("")]
        [ProducesResponseType(200)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<StatisticDriver>>> SaveStatisticDrivers([FromBody] StatisticDriverSaveData statisticDriverSaveData, CancellationToken cancellationToken)
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
                return StatusCode(StatusCodes.Status400BadRequest);
            }

            if (statisticDriverSaveData.DeletedStatDrivers.Count > 0)
            {
                await _statisticDriversRepository.DeleteStatisticDriversAsync(statisticDriverSaveData.DeletedStatDrivers, cancellationToken);
            }
            var statDrivers = await _statisticDriversService.LoadStatisticDrivers(statisticDriverSaveData.CostingType, cancellationToken);

            return Ok(statDrivers);
        }
    }
}

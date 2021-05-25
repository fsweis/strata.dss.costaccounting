﻿using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public interface ICostAccountingRepository
    {
        public Task<IEnumerable<CostAccountingModel>> GetAllCostAccountingsAsync(CancellationToken cancellationToken);
        public Task<CostAccountingModel> GetCostAccountingAsync(Guid id, CancellationToken cancellationToken);
        public Task<IList<DataTable>> GetDataTablesAsync(IList<string> globalIds, CancellationToken cancellationToken);
        public Task<IList<Measure>> GetMeasuresAsync(IList<DataTable> dataTables, CancellationToken cancellationToken);
        public Task<IList<RuleEngineIncludedMeasure>> GetRuleEngineIncludedMeasuresAsync(CancellationToken cancellationToken); 
    }
}

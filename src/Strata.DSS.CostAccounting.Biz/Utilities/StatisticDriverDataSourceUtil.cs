using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.Utilities
{
    public static class StatisticDriverDataSourceUtil
    {
        public static List<Guid> GetDataTableGuids(Boolean isClaims)
        {
            var dataTableGuids = new List<Guid>();
            dataTableGuids.Add(DataTableConstants.DSSGLGuid);
            if (isClaims)
            {
                dataTableGuids.Add(DataTableConstants.PatientClaimChargeLineItemDetailGuid);
                dataTableGuids.Add(DataTableConstants.PatientClaimSummaryGuid);
                dataTableGuids.Add(DataTableConstants.ClaimCostingStatisticDriverGuid);
                dataTableGuids.Add(DataTableConstants.ClaimStatisticDriverGuid);
            }
            else
            {
                dataTableGuids.Add(DataTableConstants.PatientBillingLineItemDetailGuid);
                dataTableGuids.Add(DataTableConstants.PatientEncounterSummaryGuid);
                dataTableGuids.Add(DataTableConstants.CostingStatisticDriverGuid);
                dataTableGuids.Add(DataTableConstants.StatisticDriverGuid);
                dataTableGuids.Add(DataTableConstants.PayrollSampledGuid);
            }
            return dataTableGuids;
        }
    }
}
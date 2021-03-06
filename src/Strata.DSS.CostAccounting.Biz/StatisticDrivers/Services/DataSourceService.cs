using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Constants;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services
{
    public class DataSourceService : IDataSourceService
    {
        public IList<DataTable> GetDataSources(CostingType costingType)
        {
            var dataSources = new List<DataTable>();

            var glSampledDataTable = new DataTable() { DataTableGuid = DataTableConstants.DSSGLGuid, GlobalId = DataTableConstants.DSSGL, FriendlyName = SDDataTableConstants.DSSGL_FriendlyName };
            dataSources.Add(glSampledDataTable);

            if (costingType == CostingType.PatientCare)
            {
                var detailDataTable = new DataTable() { DataTableGuid = DataTableConstants.PatientBillingLineItemDetailGuid, GlobalId = DataTableConstants.PatientBillingLineItemDetail, FriendlyName = SDDataTableConstants.PBLID_FriendlyName };
                dataSources.Add(detailDataTable);

                var payrollDataTable = new DataTable() { DataTableGuid = DataTableConstants.PayrollSampledGuid, GlobalId = DataTableConstants.PayrollSampled, FriendlyName = SDDataTableConstants.Payroll_FriendlyName };
                dataSources.Add(payrollDataTable);

                var statDriverDataTable = new DataTable() { DataTableGuid = DataTableConstants.StatisticDriverGuid, GlobalId = DataTableConstants.StatisticDriver, FriendlyName = SDDataTableConstants.StatDriver_FriendlyName };
                dataSources.Add(statDriverDataTable);

                var GL_PAYROLL_DATASOURCE_ID = new Guid(SDDataTableConstants.GL_PAYROLL_DATASOURCE_ID);
                //Load GL/Payroll combined dummy datasource
                var glPDataTable = new DataTable() { DataTableGuid = GL_PAYROLL_DATASOURCE_ID, FriendlyName = SDDataTableConstants.GL_PAYROLL_DATASOURCE_FriendlyName, GlobalId = SDDataTableConstants.GL_PAYROLL_DATASOURCE_FriendlyName };
                dataSources.Add(glPDataTable);
            }
            else
            {
                //Claims
                var claimDetailDataTable = new DataTable() { DataTableGuid = DataTableConstants.PatientClaimChargeLineItemDetailGuid, GlobalId = DataTableConstants.PatientClaimChargeLineItemDetail, FriendlyName = SDDataTableConstants.ClaimDetail_FriendlyName };
                dataSources.Add(claimDetailDataTable);

                var claimStatisticDriverDataTable = new DataTable() { DataTableGuid = DataTableConstants.ClaimStatisticDriverGuid, GlobalId = DataTableConstants.ClaimStatisticDriver, FriendlyName = SDDataTableConstants.ClaimStatDriver_FriendlyName };
                dataSources.Add(claimStatisticDriverDataTable);
            }

            return dataSources.OrderBy(x => x.FriendlyName).ToList();
        }
    }
}

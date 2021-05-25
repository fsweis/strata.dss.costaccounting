using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Constants;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services
{

    public class DataSourceService:IDataSourceService
    {
        private readonly ICostAccountingRepository _costaccountingRepository;
        public DataSourceService(ICostAccountingRepository costaccountingRepository)
        {
            _costaccountingRepository = costaccountingRepository;

        }
        public IList<DataTable> GetDataSources(Boolean isClaims)
        {
            var dataSources = new List<DataTable>();

            var glSampledDataTable = new DataTable() { DataTableGuid = DataTableConstants.DSSGLGuid, GlobalID = DataTableConstants.DSSGL, FriendlyName = SDDataTableConstants.DSSGL_FriendlyName }; 
            dataSources.Add(glSampledDataTable);

            if (!isClaims)
            {
               var detailDataTable = new DataTable() { DataTableGuid = DataTableConstants.PatientBillingLineItemDetailGuid, GlobalID = DataTableConstants.PatientBillingLineItemDetail, FriendlyName = SDDataTableConstants.PBLID_FriendlyName };
               dataSources.Add(detailDataTable);
            
               var payrollDataTable = new DataTable() { DataTableGuid = DataTableConstants.PayrollSampledGuid, GlobalID = DataTableConstants.PayrollSampled, FriendlyName = SDDataTableConstants.Payroll_FriendlyName };
               dataSources.Add(payrollDataTable);
                
               var  statDriverDataTable = new DataTable() { DataTableGuid = DataTableConstants.StatisticDriverGuid, GlobalID = DataTableConstants.StatisticDriver, FriendlyName = SDDataTableConstants.StatDriver_FriendlyName };
               dataSources.Add(statDriverDataTable);
    
               var  GL_PAYROLL_DATASOURCE_ID = new Guid(SDDataTableConstants.GL_PAYROLL_DATASOURCE_ID);
                //Load GL/Payroll combined dummy datasource
                var glPDataTable = new DataTable() { DataTableGuid = GL_PAYROLL_DATASOURCE_ID, FriendlyName = SDDataTableConstants.GL_PAYROLL_DATASOURCE_FriendlyName, GlobalID = SDDataTableConstants.GL_PAYROLL_DATASOURCE_FriendlyName };
                dataSources.Add(glPDataTable);
            }
            else
            {
                //Claims
                var claimDetailDataTable = new DataTable() { DataTableGuid = DataTableConstants.PatientClaimChargeLineItemDetailGuid, GlobalID = DataTableConstants.PatientClaimChargeLineItemDetail, FriendlyName = SDDataTableConstants.ClaimDetail_FriendlyName };
                dataSources.Add(claimDetailDataTable);

                var claimStatisticDriverDataTable = new DataTable() { DataTableGuid = DataTableConstants.ClaimStatisticDriverGuid, GlobalID = DataTableConstants.ClaimStatisticDriver, FriendlyName = SDDataTableConstants.ClaimStatDriver_FriendlyName };
                dataSources.Add(claimStatisticDriverDataTable);
            }
            return dataSources.OrderBy(x => x.FriendlyName).ToList();
        }
    }
}

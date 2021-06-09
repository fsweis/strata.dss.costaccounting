using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class Entity
    {
        public int EntityID { get; set; }
        public Guid MemberGuid { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public int SortOrder { get; set; }
        public bool CAPIsDefined {get;set;}
        public bool DSSIsDefined{ get; set; }
        public bool OBIsDefined { get; set; }
        public bool SPIsDefined { get; set; }
        public string Name { get; set; }
    }
}

using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class ConfigForm
    {
        public string Name { get; set; }
        public String Description { get; set; }
        public int Year { get; set; }
        public int ytdMonth { get; set; }
        public CostingType type { get; set; }
        public List<string> FilteredEntities { get; set; }
        public int UtilizationEntities { get; set; }
        public List<string> SpecifiedUtilizationEntities { get; set; }
        public int Method { get; set; }
        public List<int> Options { get; set; }
    }

}

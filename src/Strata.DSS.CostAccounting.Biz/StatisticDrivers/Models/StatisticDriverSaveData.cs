﻿using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class StatisticDriverSaveData : ICollectionSaveData<StatisticDriver>
    {
        public CostingType CostingType { get; set; }
    }

}
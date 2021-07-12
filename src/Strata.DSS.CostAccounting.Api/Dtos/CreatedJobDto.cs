using System;

namespace Strata.DSS.CostAccounting.Api.Dtos
{
    /// <summary>
    /// Object represents a newly created Hangfire task
    /// </summary>
    public class CreatedJobDto
    {
        /// <summary>
        /// Hangfire JobId of the created task
        /// </summary>
        public Guid JobId { get; set; }
    }
}

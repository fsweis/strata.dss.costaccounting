using Newtonsoft.Json;
using System;
using System.Runtime.Serialization;

namespace Strata.DSS.CostAccounting.Biz.Exceptions
{
    [Serializable]
    public class ApiException : Exception
    {
        public object RequestParams { get; }
        protected ApiException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }

        public ApiException(string message, Exception innerException, params object[] requestParams) : base(message, innerException)
        {
            RequestParams = requestParams ?? new object();
        }

        public override string ToString() =>
            $"{base.ToString()}, RequestParams: {JsonConvert.SerializeObject(RequestParams)}";
    }
}

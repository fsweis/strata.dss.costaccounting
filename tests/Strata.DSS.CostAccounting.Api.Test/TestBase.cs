using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.Test
{
    public class TestBase
    {
        internal string ConnectionString;
        internal Dictionary<string, string> ConnectionConfig;

        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            ConnectionString = TestData.GetConnectionString();
            ConnectionConfig = TestData.GetConnectionConfig(ConnectionString);
        }
    }

    public static class HttpResponseExtensions
    {
        public static async Task<T> ToValue<T>(this Task<HttpResponseMessage> httpTask)
        {
            var res = await httpTask;
            var json = await res.Content.ReadAsStringAsync();
            T obj;
            try
            {
                obj = JsonConvert.DeserializeObject<T>(json);
            }
            catch (Exception ex)
            {
                throw new Exception(json, ex);
            }
            if (obj == null)
            {
                throw new Exception(res.ToString());
            }
            return obj;
        }
    }
}

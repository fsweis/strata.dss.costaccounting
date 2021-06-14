using Newtonsoft.Json;
using Strata.ApiCommunication.Http;
using Strata.DSS.CostAccounting.Client.DTO;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Client
{
    public class StatisticDriversServiceClient : IStatisticDriversServiceClient
    {
        private readonly HttpClient _httpClient;

        public StatisticDriversServiceClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Set json options to match what's on the server
        // This is necessary so enums are deserialized correctly
        private readonly JsonSerializerOptions options = new JsonSerializerOptions
        {
            Converters =
            {
                new JsonStringEnumConverter()
            },
            PropertyNameCaseInsensitive = true
        };

        public async Task<IEnumerable<StatisticDriver>> GetStatisticDrivers(CancellationToken cancellationToken = default)
        {
            using (var request = new HttpRequestMessage(HttpMethod.Get, $"api/v1/StatisticDrivers/GetStatisticDrivers"))
            {
                var res = await _httpClient.SendAsync<IEnumerable<StatisticDriver>>(request, options, cancellationToken).ConfigureAwait(false);
                return res;
            }
        }

        public async Task<IEnumerable<DataTable>> GetDataSources(CancellationToken cancellationToken = default)
        {
            using (var request = new HttpRequestMessage(HttpMethod.Get, $"api/v1/StatisticDrivers/GetDataSources"))
            {
                var res = await _httpClient.SendAsync<IEnumerable<DataTable>>(request, options, cancellationToken).ConfigureAwait(false);
                return res;
            }
        }

        public async Task<IEnumerable<DataSourceLink>> GetDataSourceLinks(CancellationToken cancellationToken = default)
        {
            using (var request = new HttpRequestMessage(HttpMethod.Get, $"api/v1/StatisticDrivers/GetDataSourceLinks"))
            {
                var res = await _httpClient.SendAsync<IEnumerable<DataSourceLink>>(request, options, cancellationToken).ConfigureAwait(false);
                return res;
            }
        }

        public async Task<IEnumerable<StatisticDriver>> SaveStatisticDrivers(StatisticDriverSaveData statisticDriverSaveData, CancellationToken cancellationToken = default)
        {
            using (var request = new HttpRequestMessage(HttpMethod.Post, $"api/v1/StatisticDrivers/SaveStatisticDrivers"))
            {
                var json = JsonConvert.SerializeObject(statisticDriverSaveData);
                using (var stringContent = new StringContent(json, Encoding.UTF8, "application/json"))
                {
                    request.Content = stringContent;

                    var res = await _httpClient.SendAsync<IEnumerable<StatisticDriver>>(request, options, cancellationToken).ConfigureAwait(false);
                    return res;
                }
            }
        }
    }
}

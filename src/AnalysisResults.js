import React from 'react';
import Chart from './Chart';
import DataTable from './DataTable';

const AnalysisResults = ({ data, comparisonData }) => {
    const chartConfigs = [
        { key: 'avgConsMake', title: "Average Consumption", type: 'bar' },
        { key: 'co2ByClass', title: "CO2 Emissions by Vehicle Class", type: 'bar' },
        { key: 'fuelTypeDist', title: "Fuel Type Distribution", type: 'pie' },
        { key: 'bestSmog', title: "Best Smog Ratings", type: 'bar' },
        { key: 'consByTrans', title: "Consumption by Transmission", type: 'bar' },
        { key: 'co2RatingPct', title: "CO2 Rating Percentages", type: 'pie' },
        { key: 'topLowCo2', title: "Top Low CO2 Emitters", type: 'bar' },
        { key: 'topEfficient', title: "Top Efficient Vehicles", type: 'bar' }
    ];

    const formatChartData = (rawData, key, isComparison) => {
      if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) return [];
  
      const processData = (data) => {
          const dataArray = Array.isArray(data) ? data : [data];
          
          switch (key) {
              case 'avgConsMake':
                  return dataArray.map(item => ({
                      label: item.MAKE,
                      value: parseFloat(item.COMBINED_CONSUMPTION)
                  }));
              case 'co2ByClass':
                  return dataArray.map(item => ({
                      label: item.VEHICLE_CLASS,
                      value: parseFloat(item.CO2_EMISSIONS)
                  }));
              case 'fuelTypeDist':
                  return dataArray.map(item => ({
                      label: item.FUEL_TYPE,
                      value: 1
                  }));
              case 'bestSmog':
                  return dataArray.map(item => ({
                      label: `${item.MAKE} ${item.MODEL}`,
                      value: parseFloat(item.SMOG_RATING)
                  }));
              case 'consByTrans':
                  return dataArray.map(item => ({
                      label: item.TRANSMISSION,
                      value: parseFloat(item.COMBINED_CONSUMPTION)
                  }));
              case 'co2RatingPct':
                  return dataArray.map(item => ({
                      label: item.CO2_RATING.toString(),
                      value: 1
                  }));
              case 'topLowCo2':
                  return dataArray.map(item => ({
                      label: `${item.MAKE} ${item.MODEL}`,
                      value: parseFloat(item.CO2_EMISSIONS)
                  }));
              case 'topEfficient':
                  return dataArray.map(item => ({
                      label: `${item.MAKE} ${item.MODEL}`,
                      value: parseFloat(item.COMBINED_CONSUMPTION)
                  }));
              default:
                  return [];
          }
      };

      if (isComparison) {
        return processData(rawData);
      } else {
        // Existing logic for overall analysis data
        return rawData.map(item => {
            const labels = Object.keys(item);
            let labelIndex, valueIndex;
    
            switch (key) {
                case 'fuelTypeDist':
                case 'avgConsMake':
                case 'co2ByClass':
                case 'consByTrans':
                case 'topLowCo2':
                    labelIndex = 1;
                    valueIndex = 2;
                    break;
                case 'bestSmog':
                case 'topEfficient':
                    labelIndex = 2;
                    valueIndex = 3;
                    break;
                case 'co2RatingPct':
                    labelIndex = 1;
                    valueIndex = 3;
                    break;
                default:
                    return null;
            }
    
            return {
                label: item[labels[labelIndex]],
                value: parseFloat(item[labels[valueIndex]])
            };
        }).filter(Boolean);
      }
    }
      
      // In the return statement
    return (
      <div className="analysis-results">
        {chartConfigs.map(({ key, title, type }) => (
          <div key={key} className="chart-section">
            <h2>{title}</h2>
            {data[key] && data[key].length > 0 ? (
              <>
                <Chart 
                  data={formatChartData(data[key], key)} 
                  title={title} 
                  type={type} 
                />
                <DataTable data={data[key]} />
              </>
            ) : (
              <p className="no-data-message">No data available for {title}.</p>
            )}
          </div>
        ))}
      </div>
    );
}

export default AnalysisResults;

// Linear Regression Prediction Engine
// Based on Python model with PreviousCycle and CycleAvg features
import modelParams from './model_params.json';

class LinearRegressionPredictor {
  /**
   * Predict next period using linear regression based on Python model approach
   * @param {Array} cycles - Array of cycle objects with startDate, endDate, cycleLength, periodLength
   * @returns {Object} - Prediction object with next period dates and model metrics
   */
  static predict(cycles) {
    if (!cycles || cycles.length < modelParams.requirements.min_cycles) {
      return {
        nextPeriod: null,
        model: null,
        confidence: 0,
        error: `Need at least ${modelParams.requirements.min_cycles} cycle(s) for predictions`
      };
    }

    // Filter valid cycles and sort by date
    const validCycles = cycles
      .filter(cycle => cycle.startDate && cycle.cycleLength && cycle.cycleLength > 0)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    if (validCycles.length < modelParams.requirements.min_cycles) {
      return {
        nextPeriod: null,
        model: null,
        confidence: 0,
        error: `Need at least ${modelParams.requirements.min_cycles} valid cycle(s) for predictions`
      };
    }

    try {
      // Prepare features following Python model approach
      const cycleLengths = validCycles.map(cycle => cycle.cycleLength);
      const periodLengths = validCycles.map(cycle => cycle.periodLength || 5);
      
      // Calculate Previous Cycle and Cycle Average features
      const previousCycle = cycleLengths[cycleLengths.length - 1]; // Most recent cycle
      const cycleAvg = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length;
      
      // Apply linear regression model: prediction = PreviousCycle * coeff1 + CycleAvg * coeff2 + intercept
      const predictedCycleLength = Math.round(
        previousCycle * modelParams.coefficients.PreviousCycle + 
        cycleAvg * modelParams.coefficients.CycleAvg + 
        modelParams.intercept
      );
      
      // Predict period length (simple average approach)
      const predictedPeriodLength = Math.round(
        periodLengths.reduce((sum, length) => sum + length, 0) / periodLengths.length
      );

      // Apply bounds as per Python model
      const boundedCycleLength = Math.max(
        modelParams.bounds.min_cycle_length, 
        Math.min(modelParams.bounds.max_cycle_length, predictedCycleLength)
      );
      const boundedPeriodLength = Math.max(3, Math.min(8, predictedPeriodLength));

      // Calculate next period start date
      const lastCycle = validCycles[validCycles.length - 1];
      const lastPeriodStart = new Date(lastCycle.startDate);
      let nextPeriodStart = new Date(lastPeriodStart);
      nextPeriodStart.setDate(nextPeriodStart.getDate() + boundedCycleLength);
      
      // Ensure the predicted date is in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      // If predicted date is in the past, calculate from today instead
      while (nextPeriodStart <= today) {
        nextPeriodStart.setDate(nextPeriodStart.getDate() + boundedCycleLength);
      }
      
      // Calculate next period end date
      const nextPeriodEnd = new Date(nextPeriodStart);
      nextPeriodEnd.setDate(nextPeriodEnd.getDate() + boundedPeriodLength - 1);

      // Calculate confidence based on data consistency
      const confidence = this.calculateModelConfidence(validCycles, cycleLengths);

      return {
        nextPeriod: {
          start: nextPeriodStart.toISOString(),
          end: nextPeriodEnd.toISOString(),
          confidence: confidence
        },
        model: {
          type: modelParams.model_type,
          version: modelParams.version,
          features: modelParams.features,
          mae: modelParams.performance_metrics.mae,
          r2Score: modelParams.performance_metrics.r2,
          accuracy: confidence * 100,
          lastTrained: new Date().toISOString(),
          dataPoints: validCycles.length,
          previousCycle: previousCycle,
          cycleAvg: cycleAvg
        },
        predictedCycleLength: boundedCycleLength,
        predictedPeriodLength: boundedPeriodLength,
        confidence: confidence
      };

    } catch (error) {
      console.error('Prediction error:', error);
      return {
        nextPeriod: null,
        model: null,
        confidence: 0,
        error: 'Failed to generate prediction'
      };
    }
  }

  /**
   * Perform linear regression on x and y data points
   * @param {Array} x - Independent variable values
   * @param {Array} y - Dependent variable values
   * @returns {Object} - Regression results
   */
  static performLinearRegression(x, y) {
    const n = x.length;
    
    // Calculate means
    const xMean = x.reduce((sum, val) => sum + val, 0) / n;
    const yMean = y.reduce((sum, val) => sum + val, 0) / n;
    
    // Calculate slope and intercept
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (x[i] - xMean) * (y[i] - yMean);
      denominator += (x[i] - xMean) ** 2;
    }
    
    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;
    
    // Calculate R-squared
    let totalSumSquares = 0;
    let residualSumSquares = 0;
    
    for (let i = 0; i < n; i++) {
      const predicted = slope * x[i] + intercept;
      totalSumSquares += (y[i] - yMean) ** 2;
      residualSumSquares += (y[i] - predicted) ** 2;
    }
    
    const r2 = totalSumSquares === 0 ? 0 : 1 - (residualSumSquares / totalSumSquares);
    
    return {
      slope,
      intercept,
      r2: Math.max(0, Math.min(1, r2)) // Bound between 0 and 1
    };
  }

  /**
   * Calculate Mean Absolute Error
   * @param {Array} x - Independent variable values
   * @param {Array} y - Actual dependent variable values
   * @param {Object} regression - Regression model
   * @returns {number} - Mean absolute error
   */
  static calculateMAE(x, y, regression) {
    const errors = x.map((xVal, i) => {
      const predicted = regression.slope * xVal + regression.intercept;
      return Math.abs(y[i] - predicted);
    });
    
    return errors.reduce((sum, error) => sum + error, 0) / errors.length;
  }

  /**
   * Calculate prediction confidence based on data quality and consistency
   * @param {Array} cycles - Cycle data
   * @param {Array} cycleLengths - Array of cycle lengths
   * @returns {number} - Confidence score between 0 and 1
   */
  static calculateModelConfidence(cycles, cycleLengths) {
    // Base confidence on data amount
    const dataAmountScore = Math.min(cycles.length / 6, 1); // Max confidence at 6+ cycles
    
    // Data consistency score (based on coefficient of variation)
    const mean = cycleLengths.reduce((sum, val) => sum + val, 0) / cycleLengths.length;
    const variance = cycleLengths.reduce((sum, val) => sum + (val - mean) ** 2, 0) / cycleLengths.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = mean === 0 ? 1 : stdDev / mean;
    const consistencyScore = Math.max(0, 1 - coefficientOfVariation);
    
    // Model fit score based on pre-trained metrics
    const modelFitScore = modelParams.performance_metrics.r2;
    
    // Weighted average following Python model approach
    const confidence = (
      dataAmountScore * 0.4 + 
      modelFitScore * 0.4 + 
      consistencyScore * 0.2
    );
    
    return Math.max(0.1, Math.min(0.95, confidence)); // Bound between 0.1 and 0.95
  }

  /**
   * Get cycle statistics for display
   * @param {Array} cycles - Cycle data
   * @returns {Object} - Statistics object
   */
  static calculateStats(cycles) {
    const validCycles = cycles.filter(cycle => cycle.cycleLength && cycle.cycleLength > 0);
    
    if (validCycles.length === 0) {
      return {
        totalCycles: 0,
        avgCycleLength: 28,
        avgPeriodLength: 4,
        minCycleLength: 28,
        maxCycleLength: 28,
        firstCycleDate: null,
        lastCycleDate: null
      };
    }

    const cycleLengths = validCycles.map(c => c.cycleLength);
    const periodLengths = validCycles.map(c => c.periodLength || 4);
    const dates = validCycles.map(c => new Date(c.startDate));

    return {
      totalCycles: validCycles.length,
      avgCycleLength: Number((cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length).toFixed(1)),
      avgPeriodLength: Number((periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length).toFixed(1)),
      minCycleLength: Math.min(...cycleLengths),
      maxCycleLength: Math.max(...cycleLengths),
      firstCycleDate: new Date(Math.min(...dates)).toISOString(),
      lastCycleDate: new Date(Math.max(...dates)).toISOString()
    };
  }
}

export default LinearRegressionPredictor;